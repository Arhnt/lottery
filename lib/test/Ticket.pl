#!/usr/bin/perl -w

use strict;
use utf8;

use FindBin qw($Bin);
use lib "$Bin/../../lib/";
use Test::More tests=>10;

use_ok ( 'Data::Ticket' );
use_ok ( 'Service::Ticket' );

my $service = new Service::Ticket();
my $ticket = new Data::Ticket(numbers=>'1,2,4,6,7,8,9,10,5,3');
my @ticketNumbers = split (',', $ticket->getNumbers());
my @luckyNumbers = (1..10);
my $guessed = 0;

is(scalar @luckyNumbers, scalar @ticketNumbers, "Lucky numbers has same length as ticket numbers.");
$guessed = $service->calcGuessed($ticket, @luckyNumbers);
is($guessed, 10, "All guessed");

@luckyNumbers = (1..4, 11..16);
is(scalar @luckyNumbers, scalar @ticketNumbers, "Lucky numbers has same length as ticket numbers.");
$guessed = $service->calcGuessed($ticket, @luckyNumbers);
is($guessed, 4);

@luckyNumbers = (11..20);
is(scalar @luckyNumbers, scalar @ticketNumbers, "Lucky numbers has same length as ticket numbers.");
$guessed = $service->calcGuessed($ticket, @luckyNumbers);
is($guessed, 0, "None guessed");

@luckyNumbers = (11..19, 7);
is(scalar @luckyNumbers, scalar @ticketNumbers, "Lucky numbers has same length as ticket numbers.");
$guessed = $service->calcGuessed($ticket, @luckyNumbers);
is($guessed, 1);
