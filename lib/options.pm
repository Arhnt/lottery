package options;
use strict;

use base 'Exporter';
our @EXPORT = qw( $URL $IP $DOMAIN %MYSQL %OPTIONS );
our @EXPORT_OK = qw ();

our $SID;
our $URL   = $ENV{'REQUEST_URI'};
our $IP    = $ENV{'REMOTE_ADDR'};
our $DOMAIN = $ENV{'HTTP_HOST'};

our %MYSQL;
$MYSQL{'host'}='localhost';
$MYSQL{'base'}='loto';
$MYSQL{'user'}='loto';
$MYSQL{'pass'}='loto';

our %OPTIONS;

$Sirius::Common::debugFile = '/tmp/loto.log';
