#!/usr/bin/perl

use CGI::Carp 'fatalsToBrowser';
use strict;
use SOAP::Lite;
use DBI;

print "Content-type: text/html\n\n"; 

my $retHead = '';
my $retBody = '';

my $response = SOAP::Lite
  -> uri('http://miyataroid999.sakura.ne.jp/CustomerHackSoap')
  -> proxy('http://miyataroid999.sakura.ne.jp/try/CustomerHack/Backend/CustomerHackSoap.cgi')
  ->getCustomerList;
my @res = $response->paramsout;
my $res = $response->result;
$retBody = $retBody."CustomerHackSoap#getCustomerList() : $response : $res : @res</br>";

$retHead = &addTitleTag($retHead, "Soap Client Tester");
$retHead = &addHeadTag($retHead);
$retBody = &addBodyTag($retBody);
my $retHtml = &addHtmlTag($retHead,$retBody);

sub addTitleTag{
  my $head = '';
  my $param = '';
  ($head,$param) = @_;
  return $head.'<title>'.$param.'</title>';
}
sub addHeadTag{
  my $main = '';
  ($main) = @_;

  my $ret = '<head>' . $main . '</head>';
  return $ret;
}

sub addBodyTag{
  my $main = '';
  ($main) = @_;

  my $ret = '<body>' . $main . '</body>';
  return $ret;
}

sub addHtmlTag{
  my $head = '';
  my $body = '';
  ($head , $body) = @_;

  my $ret = '<html>' . $head . $body . '</html>';
  return $ret;
}

print($retHtml);
exit;
