#!/usr/bin/perl
use strict;
use utf8;

use FindBin qw($Bin);
use lib "$Bin/../../lib/";
use CGI::Carp qw ( fatalsToBrowser );

use options;
use global;

use Sirius::Common qw(debug);

#=======================Variables=========================

our $sql      = Sirius::MySQL->new(host=>$MYSQL{'host'}, db=>$MYSQL{'base'}, user=>$MYSQL{'user'}, password=>$MYSQL{'pass'}, debug=>1);
my $dbh      = $sql->connect;
my $CGI      = new CGI;
my $template = Template->new({RELATIVE=>1});

my $json = JSON->new->utf8->allow_blessed->convert_blessed;


# Используемые переменные
# vars - переменные шаблона TT
# lang - текущий язык, устанавливается функцией get_lang
# redirect - флаг переадрессации,содержит новый адрес
my ($vars, $redirect); 

# Cookies - принимаем Cookie от клиента, ожидаем sid
my %cookies = fetch CGI::Cookie;

# Идентификатор сессии принимаем из Cookie
my $sid = ($cookies{'sid'}) ? $cookies{'sid'}->value : undef;
# Загружаем сессию с принятым ID или начинаем новую со сгенерированым идентификатором
my $cgiSession = new CGI::Session("driver:MySQL;", $sid, {Handle=>$dbh});
$cgiSession->expire('1h');

# Cookie с идентификатором сессии к клиенту
my $cookie = new CGI::Cookie(-name=>'sid', -value=>$cgiSession->id());

# Сервисы
my $sessionService = new Service::Session();
my $ticketService = new Service::Ticket();
my $optionsService = new Service::Options();
my $userService = new Service::User();
my $gameService = new Service::Game(ticketService=>$ticketService, optionsService=>$optionsService, sessionService=>$sessionService);
my $budgetService = new Service::Budget();

#=======================Template Variables================
 
$vars->{'error'} = "";

#=======================Main Stage========================	
if ($URL =~ /\/options\/save(\/|$)/)
{
  foreach (keys %{$CGI->Vars})
  {
    $optionsService->set($_, $CGI->param($_));
  }
  my $nextGame = $gameService->calcNextGameRunTime();
  $optionsService->set('nextGameTime', $nextGame);
  $optionsService->save();
  $budgetService->recalcLastBudget($optionsService);
  $redirect = '/lotora/admin/';
}
elsif ($URL =~ /\/game\/run(\/|$)/)
{
  $optionsService->load();
  $gameService->makeGame();
  $redirect = '/lotora/admin/games/';
}

$optionsService->load();

#--------Headers---------
if($URL =~ /\/ajax(\/|$)/)
{
  print $CGI->header(-expires=>'now', -charset=>'UTF-8', -pragma=>'no-cache', -cookie=>$cookie);
  ajax_stage();
}
elsif($redirect)
{
    print $CGI->redirect(-uri=>$redirect, -cookie=>$cookie);
}
else
{
    print $CGI->header(-expires=>'now', -charset=>'UTF-8', -pragma=>'no-cache', -cookie=>$cookie);
    $template->process("../../tmpl/admin.tmpl", $vars) || die "Template process failed: ", $template->error(), "\n";
}

#=======================End Main Stage====================

$cgiSession->flush();
$sql->disconnect();
 
#====================== Subs =============================

# Функция вызывается, если в ссылке есть /ajax/
sub ajax_stage
{
  if($URL =~ /\/options\//)
  {
    printOptions();
  }
  elsif($URL =~ /\/sessions\//)
  {
    printSessions();
  }
  elsif($URL =~ /\/tickets\//)
  {
    printAllSimpleObjects($ticketService);
  }
  elsif($URL =~ /\/users\//)
  {
    printAllSimpleObjects($userService);
  }
  elsif($URL =~ /\/games\//)
  {
    printGames();
  }
  elsif($URL =~ /\/budget\//)
  {
    printAllSimpleObjects($budgetService);
  }
  elsif ($URL =~ /\/session\/pay\/(\d+)/)
  {
    my $session = $sessionService->findById($1);
    $sessionService->pay($session);
    print "{success: true}";
  }
}

sub printOptions()
{
  my @options;
  foreach($optionsService->getAllNames())
  {
    push(@options, $_ . ":" . "'" . $optionsService->get($_) . "'");
  }
  print "{success: true, data: { " . join(',', @options) . "}}";
}

sub printSessions()
{
  my $json->{success} = 'true';
  foreach my $obj ($sessionService->findAll())
  {
    my $session = unbless($obj);
    my @tickets = $ticketService->findBySessionId($obj->getId());
    foreach my $ticket(@tickets)
    {
      push(@{$session->{tickets}}, unbless($ticket));
    }
    push(@{$json->{data}}, $session);
  }
  print JSON::to_json($json);
}

sub printGames
{
  my $json->{success} = 'true';
  foreach my $game ($gameService->findAll())
  {
    my $obj = unbless($game);
    my @tickets = $gameService->findGameHistory($game->getId());
    foreach my $ticket(@tickets)
    {
      push(@{$obj->{tickets}}, $ticket);
    }
    my $budget = $gameService->findGameBudget($game->getId());
    $obj->{'prize'} = $budget->{'prize'};
    $obj->{'winners'} = $gameService->findWinners($game->getId());
    push(@{$json->{data}}, unbless($obj));
  }
  print JSON::to_json($json);
}

sub printAllSimpleObjects
{
  my $service = shift;
  my $json->{success} = 'true';
  foreach my $obj ($service->findAll())
  {
    push(@{$json->{data}}, unbless($obj));
  }
  print JSON::to_json($json);
}

sub unbless
{
  my $obj = shift;
  my $hash;
  foreach my $attr (keys %$obj)
  {
    $hash->{$attr} = $obj->{$attr};
  }
  return $hash;
}
