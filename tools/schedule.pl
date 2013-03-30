#!/usr/bin/perl
use lib "/mnt/hgfs/Development/Perl/pemes/lottery/code/lib/";
use options;
use global;
use Sirius::Common qw(debug);

our $sql = Sirius::MySQL->new(host=>$MYSQL{'host'}, db=>$MYSQL{'base'}, user=>$MYSQL{'user'}, password=>$MYSQL{'pass'}, debug=>1);
my $dbh = $sql->connect;

my $sessionService = new Service::Session();
my $ticketService = new Service::Ticket();
my $optionsService = new Service::Options();
my $userService = new Service::User();
my $budgetService = new Service::Budget();
my $gameService = new Service::Game(ticketService=>$ticketService, optionsService=>$optionsService, sessionService=>$sessionService);

$optionsService->load();
$gameService->runSchedule();

$sql->disconnect();
