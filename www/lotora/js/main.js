function addHintToInputs()
{
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++)
  {
    if(inputs[i].title)
    {
      inputs[i].onfocus = hideInputHint;
      inputs[i].onblur = showInputHint;
      showInputHint(inputs[i]);
    }
  }
  var inputs = document.getElementsByTagName("textarea");
  for (var i = 0; i < inputs.length; i++)
  {
    if(inputs[i].title)
    {
      inputs[i].onfocus = hideInputHint;
      inputs[i].onblur = showInputHint;
      showInputHint(inputs[i]);
    }
  }

}

function showInputHint(e)
{
  var item;
  if(e && typeof(e.target) == "object")
    item = e.target;
  else if(typeof(e) == "object")
    item = e;
  else if(window.event && e.srcElement)
    item = e.srcElement;

  if(item && item.title && !item.value ) 
    item.style.backgroundImage = "url(/lotora/img/hint/" + item.title + ".png)";
  else if(item)
    hideInputHint(item);
}

function hideInputHint(e)
{
  var item;
  if(e && typeof(e.target) == "object")
    item = e.target;
  else if(typeof(e) == "object")
    item = e;
  else if(window.event && e.srcElement)
    item = e.srcElement;

  if(item)
    item.style.backgroundImage = "";
}

function cssAddClass(item, className){
    if(item)
        item.className += " " + className;
}

function cssRemoveClass(item, className){
    var reClass=new RegExp(className,"");
    if (item && item.className)
        item.className = item.className.replace(reClass,'');
}

function cssSetClass(item, className){
    if(item)
    {
        item.setAttribute('className',className);
        item.setAttribute('class', className);
    }
}
 
function toggleLotteryNumber(num)
{
  hidePayment();
  var href = document.getElementById("lottery_num_" + num);
  if(isNumSelected(num))
  {
    removeNum(num);
    cssRemoveClass(href, "selected");
  }
  else if(countSelectedNumbers() >= config.maxNumbers)
  {
    alert("Вы выбрали максимальное количество номеров.");
  }
  else
  {
    addNum(num);
    cssAddClass(href, "selected");
  }
  var selected = countSelectedNumbers()
  document.getElementById("count_selected_numbers").innerHTML = selected;
  if(selected == config.maxNumbers)
  {
    updateSum()
  }
}

function countSelectedNumbers()
{
  var numbers_list = document.forms[0]["selected_lottery_numbers"].value;
  if(numbers_list)
  {
    var numbers = numbers_list.split(",");
    return numbers.length;
  }
  return 0;
}

function isNumSelected(num)
{
  if(!num)
  {
    return false;
  }
  var numbers_list = document.forms[0]["selected_lottery_numbers"].value;
  if(numbers_list)
  {
    var numbers = numbers_list.split(",");
    for(var i = 0; i < numbers.length; i++)
    {
      if(num == numbers[i])
      {
        return true;
      }
    }
  }
  return false;
}

function addNum(num)
{
  var numbers_list = document.forms[0]["selected_lottery_numbers"].value;
  if(numbers_list)
  {
    var numbers = numbers_list.split(",");
    numbers.push(num);
    document.forms[0]["selected_lottery_numbers"].value = numbers.join(",");
 }
  else
  {
    document.forms[0]["selected_lottery_numbers"].value = num;
  }
}

function removeNum(num)
{
  var numbers_list = document.forms[0]["selected_lottery_numbers"].value;
  if(numbers_list)
  {
    var numbers = numbers_list.split(",");
    for(var i = 0; i < numbers.length; i++)
    {
      if(num == numbers[i])
      {
        numbers.splice(i, 1);
        break;
      }
    }
    document.forms[0]["selected_lottery_numbers"].value = numbers.join(",");
  }
}

function autoSelectNumbers()
{
  hidePayment();
  document.forms[0]["selected_lottery_numbers"].value = "";
  for(var i = 1; i <= config.maxNumber; i++)
  {
    cssRemoveClass(document.getElementById("lottery_num_" + i), "selected");
  }
  
  var selectedNumbers = 0;
  while(selectedNumbers < config.maxNumbers)
  {
    var num = Math.floor((Math.random() * config.maxNumber) + 1);
    if(!isNumSelected(num))
    {
      selectedNumbers++;
      addNum(num);
      cssAddClass(document.getElementById("lottery_num_" + num), "selected");
    }
  }
  document.getElementById("count_selected_numbers").innerHTML = countSelectedNumbers();
  updateSum();
}  

function incGame()
{
  var val = document.forms[0]["games_count"].value;
  if(isNaN(val) || val < 1)
  {
    val = 1;
  }
  else if(val < config.maxGames)
  {
    val++;
  }
  else
  {
    val = config.maxGames;
  }
  document.forms[0]["games_count"].value = val;
  updateSum();
}

function decGame()
{
  var val = document.forms[0]["games_count"].value;
  if(isNaN(val) || val <= 1)
  {
    val = 1;
  }
  else if(val <= config.maxGames)
  {
    val--;
  }
  else
  {
    val = config.maxGames;   
  }
  document.forms[0]["games_count"].value = val;
  updateSum();
}

function addTicket()
{
  var selected = countSelectedNumbers();
  if(selected < config.maxNumbers)
  {
    alert("Вы выбрали не все числа. Осталось " + (config.maxNumbers - selected));
    return;
  }
  document.forms[0].action = "/lotora/ticket/add/";
  document.forms[0].submit();
}

function submitTickets()
{
  var selected = countSelectedNumbers();
  if((session.tickets > 0) && (selected == 0))
  {
    document.forms[0].action = "/lotora/ticket/submit/";
    document.forms[0].submit();
  }
  else if((session.tickets > 0) && (selected < config.maxNumbers))
  {
    if(confirm("Вы выбрали не все числа для текущего билета. Оплатить '" + session.tickets + "' уже добавленных?"))
    {
      document.forms[0].action = "/lotora/ticket/submit/";
      document.forms[0].submit();
    }
  }
  else if(selected == config.maxNumbers)
  {
    document.forms[0].action = "/lotora/ticket/add/submit/";
    document.forms[0].submit();
  }
  else
  {
    alert("Вы выбрали не все числа. Осталось " + (config.maxNumbers - selected));
  }
  return;
}

function updateSum()
{
  var sum = session.totalSum;
  var selected = countSelectedNumbers();
  if(selected == config.maxNumbers)
  {
    var games = document.forms[0]["games_count"].value;
    if(isNaN(games))
    {
      games = 1;
      document.forms[0]["games_count"].value = games;
    }
    sum = Math.round((sum + config.gamePrice * games)*10)/10;
  }
  document.getElementById("total_sum").innerHTML = sum;
}

function deleteTicket(ticketId)
{
  if(confirm("Удалить билет?"))
  {
    document.forms[0].action = "/lotora/ticket/delete/" + ticketId;
    document.forms[0].submit();
  }
}

function hidePayment()
{
   var div = document.getElementById("payment");
   if(div)
   {
     div.style.display = 'none';
   }
}