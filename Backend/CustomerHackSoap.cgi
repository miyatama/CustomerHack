#!/usr/bin/perl

use utf8;
use CGI::Carp 'fatalsToBrowser';
use SOAP::Transport::HTTP;
use DBI;

our $driver = '';
our $dbname = '';
our $dbhost = '';
our $dbuser = '';
our $dbpassword = '';

require 'info.dat';

SOAP::Transport::HTTP::CGI
  -> dispatch_to('CustomerHackSoap')
  -> handle;

package CustomerHackSoap;

sub getCustomerList(){
  my $sql =<<"EOF";
    SELECT
       customer.id
      ,customer.customer_id
      ,customer.customer_name
      ,customer.sex
      ,sex.name as sex_name
      ,customer.zip
      ,zip.zipcode
      ,customer.pref_cd
      ,pref.name as pref_name
      ,customer.memo
      ,customer.adddate
      ,customer.moddate
    FROM
      ch_m_customer customer
      LEFT OUTER JOIN ch_m_sex sex ON
        customer.sex = sex.id
      LEFT OUTER JOIN ch_m_zip zip ON
        customer.zip = zip.id
      LEFT OUTER JOIN ch_m_pref pref ON
        customer.pref_cd = pref.id
    ORDER BY
      customer.customer_name
EOF

  my $errcode = 0;
  my $errmsg = '';
  my @recs = ();
  eval{
    my $db = &connect($driver ,$dbname ,$dbhost ,$dbuser ,$dbpassword) or die "can't open database.";
    my $sth = $db->prepare($sql) or die "can't call method prepare.";
  
    $sth->execute() or die "can't execute sql.sql : $sql";
    while( my $rec = $sth->fetchrow_arrayref){

      my ($id ,$customer_id ,$customer_name ,$sex ,$sex_name ,$zip ,$zipcode ,$pref_cd ,$pref_name ,$memo ,$adddate ,$moddate) = @$rec;
      
      push @recs,[
        (
            SOAP::Data->name(id => $id )
           ,SOAP::Data->name(customer_id => $customer_id )
           ,SOAP::Data->name(customer_name)->type(string => $customer_name)
           ,SOAP::Data->name(sex => $sex )
           ,SOAP::Data->name(sex_name => $sex_name )
           ,SOAP::Data->name(zip => $zip )
           ,SOAP::Data->name(zipcode => $zipcode )
           ,SOAP::Data->name(pref_cd => $pref_cd )
           ,SOAP::Data->name(pref_name => $pref_name )
           ,SOAP::Data->name(memo => $memo )
           ,SOAP::Data->name(adddate => $adddate )
           ,SOAP::Data->name(moddate => $moddate)
        )] or die;
    }
    &disconnect($db) or die "can't close database";
  };
  if($@){
    $errcode = 1;
    $errmsg = $@;
  }
  if( @recs == 0){
    $errcode = 0;
    $errmsg = 'custmer data not found.';

  }
  my @ret = (
    SOAP::Data->name(errcode  => $errcode)
    ,SOAP::Data->name(errmsg  => $errmsg )
    ,SOAP::Data->name(customerlist => @recs)
  );
  return @ret;
}

sub connect(){
  my ($driver ,$dbname ,$dbhost ,$dbuser ,$dbpassword ) = @_;
  my $db = DBI->connect(
    "DBI:$driver:$dbname:$dbhost"
    ,$dbuser
    ,$dbpassword
    ,{
        mysql_enable_utf8 => 1,
        on_connect_do => ['SET NAMES utf8'],
    });
  return $db;
}

sub disconnect(){
  my $db;
  ($db) = @_;

  $db->disconnect() or die;
}
