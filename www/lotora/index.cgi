#!/usr/bin/perl
use strict;
use utf8;

use FindBin qw($Bin);
use lib "$Bin/../../lib/";
use CGI::Carp qw ( fatalsToBrowser );
use Date::Calc qw ( Mktime );

use options;
use global;

use Sirius::Common qw(debug);

#=======================Variables=========================

our $sql      = Sirius::MySQL->new(host=>$MYSQL{'host'}, db=>$MYSQL{'base'}, user=>$MYSQL{'user'}, password=>$MYSQL{'pass'}, debug=>1);
my $dbh      = $sql->connect;
my $CGI      = new CGI;
my $template = Template->new({RELATIVE=>1});

# Сервисы
my $sessionService = new Service::Session();
my $ticketService = new Service::Ticket();
my $optionsService = new Service::Options();
$optionsService->load();
my $userService = new Service::User();
my $gameService = new Service::Game(ticketService=>$ticketService, optionsService=>$optionsService, sessionService=>$sessionService);

# Используемые переменные
# vars - переменные шаблона TT
# lang - текущий язык, устанавливается функцией get_lang
# redirect - флаг переадрессации,содержит новый адрес
my ($vars, $redirect); 

# Cookies - принимаем Cookie от клиента, ожидаем sid
my %cookies = fetch CGI::Cookie;

# Идентификатор сессии принимаем из Cookie
my $sid = ($cookies{'sid'}) ? $cookies{'sid'}->value : undef;
my $lang = 'ru';

# Загружаем сессию с принятым ID или начинаем новую со сгенерированым идентификатором
my $cgiSession = new CGI::Session("driver:MySQL;", $sid, {Handle=>$dbh});
$cgiSession->expire('1h');

# Игровая сессия
# Ищется последняя неоплаченая игровая сессия привязаная к CGI сессии
my $session = $sessionService->findByCgiSessionId($cgiSession->id());
if(!$session)
{
    $session = new Data::Session(cgi_session=>$cgiSession->id(), game_price=>$optionsService->get('gamePrice'));
    $sessionService->save($session);
}
elsif($session->getPaid())
{
  $cgiSession = new CGI::Session("driver:MySQL;", undef, {Handle=>$dbh});
  $session = new Data::Session(cgi_session=>$cgiSession->id(), game_price=>$optionsService->get('gamePrice'));
  $sessionService->save($session);
}

# Cookie с идентификатором сессии к клиенту
my $cookie = new CGI::Cookie(-name=>'sid', -value=>$cgiSession->id());

# Текущий пользователь
my $user = new Data::User();
if($session->getUserId())
{
  $user = $userService->findById($session->getUserId());
}
$userService->processCGIRequest($user, $CGI);
if($user->getAsfnId())
{
  $userService->save($user);
}
if(!$session->getUserId() && $user->getId())
{
  $session->setUserId($user->getId());
  $sessionService->save($session);
}


#=======================Template Variables================
 
$vars->{'lang'} = $lang;
$vars->{'properties'}->{'lang'} = $lang;

$vars->{'html'}->{'body'}->{'onload'} .= "addHintToInputs(); ";

$vars->{'data'}->{'global'}->{'maxNumber'} = $optionsService->get('maxNumber') || 27;
$vars->{'data'}->{'global'}->{'maxNumbers'} = $optionsService->get('maxNumbers') || 10;
$vars->{'data'}->{'global'}->{'gamePrice'} = $optionsService->get('gamePrice') || 0.1;
$vars->{'data'}->{'global'}->{'maxGames'} = $optionsService->get('maxGames') || 10;
$vars->{'data'}->{'global'}->{'asfnId'} = $optionsService->get('asfnId') || 'AAA00000';
$vars->{'data'}->{'global'}->{'winSum'} = $optionsService->get('totalWin');

$vars->{'data'}->{'session'}->{'selectedNumbers'} = 0; # Выбрано чисел
$vars->{'data'}->{'session'}->{'totalSum'} = 0; # Всего выиграно
$vars->{'data'}->{'session'}->{'tickets'} = [];
$vars->{'data'}->{'session'}->{'games'} = 1;
$vars->{'data'}->{'session'}->{'userAsfnId'} = $user->getAsfnId();
$vars->{'data'}->{'session'}->{'userName'} = $user->getName();
$vars->{'data'}->{'session'}->{'userEmail'} = $user->getEmail();
$vars->{'data'}->{'session'}->{'userCountry'} = $user->getCountry();
$vars->{'data'}->{'session'}->{'userCity'} = $user->getCity();
$vars->{'data'}->{'session'}->{'key'} = $session->getKey();

$vars->{'data'}->{'session'}->{'nextGames'} = $gameService->calcNextGames(5);

$vars->{'error'} = "";

my $lastGame = $gameService->findLastGame();
if($lastGame)
{
  $vars->{'data'}->{'last'}->{'gameNum'} = $lastGame->getId();
  $vars->{'data'}->{'last'}->{'gameDate'} = $lastGame->getDate();
  $vars->{'data'}->{'last'}->{'luckyNumbers'} = $lastGame->getLuckyNumbers();
  $vars->{'data'}->{'last'}->{'winSum'} = $optionsService->get('lastWin');
  my %stat = $gameService->calcStatistics($lastGame);
  $vars->{'data'}->{'last'}->{'statistics'} = \%stat;

  # Video
  $lastGame->getDate() =~ /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
  
  my $game = Mktime($1,$2,$3, $4,$5,$6);
  my $now = time;
  if ($now > ($game + $optionsService->get('lastVideoLifespan') * 60 * 60))
  {
    $optionsService->set('lastVideo', '');
    $optionsService->save();
  }
  $vars->{'data'}->{'last'}->{'video'} = $optionsService->get('lastVideo');
}

#=======================Main Stage========================	
if (($URL =~ /\/ticket\//) && ($URL =~ /\/add(\/|$)/))
{
  my $countGames = $CGI->param('games_count');
  my $numbersList = $CGI->param('selected_lottery_numbers');
  my @numbers = sort {$a <=> $b} split(',', $numbersList);
  my $ticket = new Data::Ticket(numbers=>join(',', @numbers), session_id=>$session->getId(), games=>$countGames);
  $vars->{'error'} = $ticketService->validate($ticket, $optionsService->get('maxNumber'), $optionsService->get('maxNumbers'));
  if(!$vars->{'error'})
  {
    $ticketService->save($ticket);
    $vars->{'data'}->{'session'}->{'games'} = $ticket->getGames();
    $redirect = "/lotora/";
  }
}
elsif (($URL =~ /\/ticket\//) && ($URL =~ /\/delete\/(\d+)/))
{
  my $ticketId = $1;
  my $ticket = $ticketService->findById($ticketId);
  if($ticket->getSessionId() == $session->getId())
  {
    $ticketService->delete($ticketId);
  }
  $redirect = "/lotora/";      
}
else
{
  my @tickets = $ticketService->findBySessionId($session->getId());
  $vars->{'data'}->{'session'}->{'tickets'} = \@tickets;
  for(my $i = 0; $i < @tickets; $i++)
  {
    my $ticketPrice = $tickets[$i]->getGames() * $vars->{'data'}->{'global'}->{'gamePrice'};
    $vars->{'data'}->{'session'}->{'totalSum'} += $ticketPrice;
  }
}

if (($URL =~ /\/ticket\//) && ($URL =~ /\/submit(\/|$)/))
{
  $vars->{'error'} = $userService->validate($user) || $sessionService->validate($session);
  if(!$vars->{'error'})
  {
    $redirect = "/lotora/submit/";      
  }
}
if ($URL =~ /\/submit(\/|$)/)
{
  $vars->{'error'} = $userService->validate($user) || $sessionService->validate($session);
  if(!$vars->{'error'})
  {
    $vars->{'data'}->{'session'}->{'submit'} = 1;
  }
}


#--------Headers---------
if($URL =~ /\/ajax(\/|$)/)
{
  print $CGI->header(-expires=>'now', -charset=>'UTF-8', -pragma=>'no-cache', -cookie=>$cookie);
}
elsif($redirect)
{
  print $CGI->redirect(-uri=>$redirect, -cookie=>$cookie);
}
else
{
  print $CGI->header(-expires=>'now', -charset=>'UTF-8', -pragma=>'no-cache', -cookie=>$cookie);
  $template->process("../../tmpl/main.tmpl", $vars) || die "Template process failed: ", $template->error(), "\n";
}

#=======================End Main Stage====================

$cgiSession->flush();
$sql->disconnect();
 
#====================== Subs =============================

# Функция вызывается, если в ссылке есть /ajax/
sub ajax_stage
{

}

