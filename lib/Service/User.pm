package Service::User;
use strict;

# Игроки
my $table = "users";

sub new
{
    my $proto = shift;                 # извлекаем имя класса или указатель на объект
    my $class = ref($proto) || $proto; # если указатель, то взять из него имя класса
    my $self  = {};
    # Приём данных из new(param=>value)
    my %params = @_;
    foreach (keys %params){
        $self->{$_} = $params{$_};
    }
    bless($self, $class);              # гибкий вызов функции bless

    return $self;
}

sub findById
{
    my ($self, $id) = @_;
    my $sth = $::sql->handle->prepare("SELECT * FROM `$table` WHERE `id`= ?");
    my $rv = $sth->execute($id);
    return undef if($rv == 0E0);
    my $ref = $sth->fetchrow_hashref();
    my $user = new Data::User(%$ref);
    return $user;
}

sub findAll
{
    my ($self) = @_;
    my $sth = $::sql->handle->prepare("SELECT * FROM `$table` ORDER BY `created`");
    my $rv = $sth->execute();
    return () if($rv == 0E0);
    my @users;
    while(my $ref = $sth->fetchrow_hashref())
    {
      push(@users, new Data::User(%$ref));
    }
    return @users;
}

sub save
{
    my ($self, $user) = @_;
    if($user->getId())
    {
        my $sth = $::sql->handle->prepare("UPDATE `$table` SET `asfn_id` = ?, `name` = ?, `email` = ?, `country` = ?, `city` = ?, `last_seen` = NOW() WHERE `id` = ?");
        $sth->execute($user->getAsfnId(), $user->getName(), $user->getEmail(), $user->getCountry(), $user->getCity(), $user->getId());
    }
    else
    {
        my $sth = $::sql->handle->prepare("INSERT INTO `$table` (`asfn_id`, `name`, `email`, `country`, `city`, `created`, `last_seen`) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
        $sth->execute($user->getAsfnId(), $user->getName(), $user->getEmail(), $user->getCountry(), $user->getCity());
        $user->setId($::sql->handle->{'mysql_insertid'});
    }
}

sub processCGIRequest
{
    my ($self, $user, $CGI) = @_;

    my $asfnId = $CGI->param('asfn_id');
    $user->setAsfnId($asfnId) if(defined $asfnId);

    my $name = $CGI->param('user_name');
    $user->setName($name) if(defined $name);

    my $email = $CGI->param('user_email');
    $user->setEmail($email) if(defined $email);

    my $country = $CGI->param('user_country');
    $user->setCountry($country) if(defined $country);

    my $city = $CGI->param('user_city');
    $user->setCity($city) if(defined $city);
}

sub validate
{
  my ($self, $user) = @_;
  if (!$user->getAsfnId() || !($user->getAsfnId() =~ /^[A-Z]{3}\d{6}$/i))
  {
    return "Укажите правильный ASFN ID";
  }
  if(!$user->getName())
  {
    return "Укажите своё имя";
  }
  if (!$user->getEmail())
  {
    return "Укажите свой e-mail";
  }
  if (!$user->getCountry() or !$user->getCity()) 
  {
    return "Укажите свой адрес";
  }

}

1;