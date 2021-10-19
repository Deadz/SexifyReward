$limit  = 15;
$url    = "images/";
$pseudo = "";

// Data load check
dt_pv = false; // Data Prix de vente
dt_dc = false; // Data DEC
dt_ct = false; // Data Cartes

$.ajax( // Prix de vente des cartes rewards
{
	url: 'https://game-api.splinterlands.com/market/for_sale_grouped/',
	dataType: 'json',
	type : 'GET',
	success: function(datas)
	{
		prices = datas.filter(obj => obj.edition == 3);
		dt_pv = true;
		loadCheck();
	}
});


$.ajax( // Prix du DEC
{
	url: 'https://prices.splinterlands.com/prices',
	dataType: 'json',
	type : 'GET',
	success: function(datas)
	{
		$decPrice = datas.dec;
		dt_dc = true;
		loadCheck();
	}
});

$.ajax( // Nom des cartes + d'autres data
{
	url: 'https://game-api.splinterlands.io/cards/get_details',
	dataType: 'json',
	type : 'GET',
	success: function(datas)
	{
		nameinfo = datas.filter(obj => obj.editions == 3);
		dt_ct = true;
		loadCheck();
	}
});

function encodeURL(str)
{
	return encodeURIComponent(str).replace(/[!'()*]/g, function(c)
	{
   	return '%' + c.charCodeAt(0).toString(16);
  	});
}

String.prototype.capitalize = function()
{
   return this.charAt(0).toUpperCase() + this.slice(1);
}

document.onkeydown = checkKey;
function checkKey(e)
{
   e = e || window.event;

   if($pseudo != "")
   {
   	if(e.keyCode == '39')
	   {
	   	$("#btn_right").click();
	   }
	   else if(e.keyCode == '37')
		{
	      $("#btn_left").click();
	   }
   }
}

function loadCheck() // On active le bouton si les datas sont chargées
{
	if(dt_ct && dt_dc && dt_pv)
	{
		$("#sub").removeProp("disabled");
	}
}

function cheeeeeese()
{
	event.preventDefault();
	html2canvas(document.querySelector("#screen"),
	{
	   allowTaint : true,
	   width : "1100",
	   windowWidth : "1100"
	}).then(canvas =>
	{
		dataURL = canvas.toDataURL();
		$("#copy").html("<img class='w3-image' src='"+dataURL+"'>");

		canvas.toBlob(function(blob)
		{
         navigator.clipboard.write([
            new ClipboardItem(Object.defineProperty({}, blob.type,
            {
               value: blob,
               enumerable: true
            }))]).then(function()
			{
				document.getElementById('view_screen').style.display='block';
      	},
	      function(error)
	      {
				$("#card_view").html("<div class='w3-panel w3-yellow w3-display-container'><span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Warning!</h3><p>Impossible to make the screenshot, contact the developers.</p></div>");
	         console.error("Unable to write to clipboard. Error:");
	         console.log(error);
	      });
		});
	});
}

function kdo()
{
	hive_keychain.requestCustomJson(null,"sm_token_transfer", "active",'{"to":"deadzy","qty":50,"token":"DEC","type":"withdraw","app":"sexify"}', "Confirm the donation of 50 DEC.");
}

function Sexify()
{
	// Reset
	$("#card_view").html("");
	$("#spin").removeClass(" w3-hide");

	event.preventDefault();

   if($("#pseudo").val() !== "")
   {
  		$pseudo = $("#pseudo").val();
  		$pseudo = $pseudo.toLowerCase();
  		$.ajax(
		{
			url: 'https://api.steemmonsters.io/players/history?username='+$pseudo+'&types=claim_reward&limit='+$limit,
			dataType: 'json',
			type : 'GET',
			success: function(datas)
			{
				if(datas.length < 1)
				{
					$("#card_view").html("<div class='w3-panel w3-yellow w3-display-container'><span onclick='this.parentElement.style.display=\"none\"' class='w3-button w3-large w3-display-topright'>&times;</span><h3>Warning!</h3><p>This player name doesn\'t exist ! Try another one.</p></div>");
				}
				else
				{
					dataclean = datas.filter(obj => obj.error === null);
					Sexify_view(0);
				}
			}     
		});

		$.ajax( // Date quest
		{
			url: 'https://api.splinterlands.io/players/quests?username='+$pseudo,
			dataType: 'json',
			type : 'GET',
			success: function(datas)
			{
				console.log(datas)
			}
		});
   }
};

function Sexify_view(idReward)
{
	$("#card_view").html("");
	if(idReward === 0)
	{
		$("#menu").html("<button type='button' id='btn_left' class='w3-button w3-round-large w3-border-black w3-border w3-gray' onclick='Sexify_view("+(idReward+1)+")'><i class='far fa-arrow-alt-circle-left fa-lg'></i> Prev.</button><button type='button' id='btn_right' class='w3-button w3-round-large w3-border-black w3-border w3-gray' onclick='Sexify_view("+(idReward)+")' disabled>Next <i class='far fa-arrow-alt-circle-right fa-lg'></i></button>");
	}
	else if(idReward === (dataclean.length-1))
	{
		$("#menu").html("<button type='button' id='btn_left' class='w3-button w3-round-large w3-border-black w3-border w3-gray' onclick='Sexify_view("+(idReward)+")' disabled><i class='far fa-arrow-alt-circle-left fa-lg'></i> Prev.</button><button type='button' id='btn_right' class='w3-button w3-round-large w3-border-black w3-border w3-gray' onclick='Sexify_view("+(idReward-1)+")'>Next <i class='far fa-arrow-alt-circle-right fa-lg'></i></button>");
	}
	else
	{
		$("#menu").html("<button type='button' id='btn_left' class='w3-button w3-round-large w3-border-black w3-border w3-gray' onclick='Sexify_view("+(idReward+1)+")'><i class='far fa-arrow-alt-circle-left fa-lg'></i> Prev.</button><button type='button' id='btn_right' class='w3-button w3-round-large w3-border-black w3-border w3-gray' onclick='Sexify_view("+(idReward-1)+")'>Next <i class='far fa-arrow-alt-circle-right fa-lg'></i></button>");
	}

	$typequest  = JSON.parse(dataclean[idReward].data).type;
	$datadecode = JSON.parse(dataclean[idReward].result);
	$date    = new Date(dataclean[idReward].created_date);
	$popoLeg = 0;
	$popoAlc = 0;
	$dec     = 0;
	$credit  = 0;
	$pack    = 0;
	$coffre  = $datadecode.rewards.length;
	$cardLst = [];
	imgbonus = "";
	$value   = 0;

	$datadecode.rewards.forEach(function(item)
	{
		switch(item.type)
		{
		   case 'reward_card':
		   	cardid   = item.card.card_detail_id;
		   	cardgold = item.card.gold;
		   	if($cardLst.find(card => card.id === cardid && card.gold === cardgold) === undefined)
		   	{
		   		// On cherche le nom de la carte
		   		dataCardName  = nameinfo.find(data => data.id === cardid);
		   		if(cardgold)
		   		{
		   			if(dataCardName.rarity === 1)
		   			{
		   				cardName = encodeURL(dataCardName.name)+"_lv3_gold.png"; // On creer l'url de l'image
		   			}
		   			else
		   			{
		   				cardName = encodeURL(dataCardName.name)+"_lv2_gold.png"; // On creer l'url de l'image
		   			}
		   		}
		   		else
		   		{
		   			cardName = encodeURL(dataCardName.name)+"_lv1.png"; // On creer l'url de l'image
		   		}

		   		// On cherche le prix de la carte
		   		dataCardPrice = prices.find(data => data.card_detail_id === cardid && data.gold === cardgold);

		   		// On ajoute les datas
		   		$cardLst.push({ id : cardid, img : cardName, qt : 1, rarity : dataCardName.rarity, gold : cardgold, price : dataCardPrice.low_price});
		   	}
		   	else
		   	{
		   		objId = $cardLst.findIndex((card => card.id === cardid && card.gold === cardgold));
		   		$cardLst[objId].qt++; 
		   	}
		   break;
		   case 'potion':
		   	if(item.potion_type === 'legendary')
		   	{
		   		$popoLeg++;
		   	}
		   	if(item.potion_type === 'gold')
		   	{
		   		$popoAlc++;
		   	}
		   break;
		   case 'dec':
		   	$dec = $dec+item.quantity;
		   break;
		   case 'credits':
		   	$credit = $credit+item.quantity;
		   break;
		   case 'packs':
		   	$pack++;
		   break;
		}
	});

	// Mise en page
	var options = { year: 'numeric', month: 'long', day: 'numeric' };
   $date = new Intl.DateTimeFormat('default', options).format($date);
	switch($typequest)
	{
		case 'league_season':
			$("#type_quest").html("<p class='w3-padding-16'><u><b>"+$pseudo.capitalize()+"</b>'s season rewards</u><span class='w3-right w3-margin-right  w3-opacity'><i class='fas fa-calendar-day'></i> "+$date+"</span></p>");
		break;

		case 'quest':
			$("#type_quest").html("<p class='w3-padding-16'><u><b>"+$pseudo.capitalize()+"</b>'s daily quest</u><span class='w3-right w3-margin-right w3-opacity'><i class='fas fa-calendar-day'></i> "+$date+"</span></p>");
		break;

	}
	
	$value = ($dec*$decPrice)+($credit/1000)+($popoLeg*0.04)+($popoAlc*0.05)+($pack*4);
	$cardLst.sort(function (a, b)
	{
	  return b.rarity-a.rarity;
	});
	$cardLst.forEach(function(card)
	{
		$value = $value+(card.qt*card.price);
		if(card.qt > 1)
		{
			$qt = "<img src='images/qty-banner.png' class='w3-display-topright' style='max-height:60px;'><b class='w3-xlarge w3-display-topright w3-margin-right'>"+card.qt+"</b>";
		}
		else
		{
			$qt = " ";
		}
		switch(card.rarity)
		{
			case 1:
				imgbonus = "";
		   break;
		   case 2:
		   	imgbonus = "<img src='images/rarity-display_2.png' width='200px;'>";
		   break;
		   case 3:
		   	imgbonus = "<img src='images/rarity-display_3.png' width='200px;'>";
		   break;
		   case 4:
		   	imgbonus = "<img src='images/rarity-display_4.png' width='200px;'>";
		   break;
		}

		$("#card_view").append("<div class='w3-display-container' style='min-width:200px; width:200px; min-height:314px'>"+imgbonus+"<img width='190px;' src='"+$url+card.img+"' class='w3-display-topmiddle'>"+$qt+"</div>");
	});

	if($dec > 0)
		$("#card_view").append("<div class='w3-display-container' style='min-width:200px; width:200px; min-height:314px'><img width='175px' class='w3-display-middle' src='images/dec.png'><b class='w3-xlarge w3-display-topmiddle'>DEC(s) <i class='fas fa-times'></i> "+$dec+"</b></div>");

	if($popoLeg > 0)
		$("#card_view").append("<div class='w3-display-container' style='min-width:200px; width:200px; min-height:314px'><img width='175px' class='w3-display-middle' src='images/legendary.png'><b class='w3-xlarge w3-display-topmiddle'> Legendary(s)<i class='fas fa-times'></i> "+$popoLeg+"</b></div>");

	if($popoAlc > 0)
		$("#card_view").append("<div class='w3-display-container' style='min-width:200px; width:200px; min-height:314px'><img width='175px' class='w3-display-middle' src='images/alchemy.png'><b class='w3-xlarge w3-display-topmiddle'> Alchemy(s)<i class='fas fa-times'></i> "+$popoAlc+"</b></div>");

	if($credit > 0)
		$("#card_view").append("<div class='w3-display-container' style='min-width:200px; width:200px; min-height:314px'><img width='175px' class='w3-display-middle' src='images/credits.png'><b class='w3-xlarge w3-display-topmiddle'> Credit(s)<i class='fas fa-times'></i> "+$credit+"</b></div>");

	if($pack > 0)
		$("#card_view").append("<div class='w3-display-container' style='min-width:200px; width:200px; min-height:314px'><img width='175px' class='w3-display-middle' src='images/pack.png'><b class='w3-xlarge w3-display-topmiddle'> Pack(s)<i class='fas fa-times'></i> "+$pack+"</b></div>");

	$("#spin").addClass(" w3-hide");
	$("#card_view").append("<div class='w3-display-container w3-leftbar w3-rightbar w3-border-orange w3-round-xxlarge' style='min-width:200px; width:200px; min-height:314px'><b class='w3-display-topmiddle w3-xlarge'>Chest(s) <i class='fas fa-times'></i> "+$coffre+"</b><img width='190px;' src='images/loot-chest_open.png' class='w3-display-middle'><p class='w3-display-bottommiddle w3-xlarge'><b>"+$value.toFixed(2)+"</b><i class='fas fa-dollar-sign'></i></p></div>");
}