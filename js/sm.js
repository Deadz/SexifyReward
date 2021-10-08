$limit = 10;
$url   = "https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/";

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

function loadCheck() // On active le bouton si les datas sont chargées
{
	if(dt_ct && dt_dc && dt_pv)
	{
		$("#sub").removeProp("disabled");
	}
}

function Sexify()
{
	// Reset
	$("#img_splinter").addClass(" w3-hide");
	$("#card_view").html("");
	$("#money").html("");
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
				dataclean = datas.filter(obj => obj.error === null)
				Sexify_view(0);
			}
		});
   }
};

function Sexify_view(idReward)
{
	$("#img_splinter").addClass(" w3-hide");
	$("#card_view").html("");
	$("#money").html("");
	if(idReward === 0)
	{
		$("#menu").html("<button class='w3-button w3-round-large w3-border-black w3-border w3-gray' onclick='Sexify_view("+(idReward+1)+")'><i class='far fa-arrow-alt-circle-left'></i> last</button><button class='w3-button w3-round-large w3-border-black w3-border w3-gray' onclick='Sexify_view("+(idReward)+")' disabled>next <i class='far fa-arrow-alt-circle-right'></i></button>");
	}
	else if(idReward === (dataclean.length-1))
	{
		$("#menu").html("<button class='w3-button w3-round-large w3-border-black w3-border w3-gray' onclick='Sexify_view("+(idReward)+")' disabled><i class='far fa-arrow-alt-circle-left'></i> last</button><button class='w3-button w3-round-large w3-border-black w3-border w3-gray' onclick='Sexify_view("+(idReward-1)+")'>next <i class='far fa-arrow-alt-circle-right'></i></button>");
	}
	else
	{
		$("#menu").html("<button class='w3-button w3-round-large w3-border-black w3-border w3-gray' onclick='Sexify_view("+(idReward+1)+")'><i class='far fa-arrow-alt-circle-left'></i> last</button><button class='w3-button w3-round-large w3-border-black w3-border w3-gray' onclick='Sexify_view("+(idReward-1)+")'>next <i class='far fa-arrow-alt-circle-right'></i></button>");
	}

	$datadecode = JSON.parse(dataclean[idReward].result);
	$popoLeg = 0;
	$popoAlc = 0;
	$dec     = 0;
	$credit  = 0;
	$coffre  = $datadecode.rewards.length;
	$cardLst = [];

	$datadecode.rewards.forEach(function(item)
	{
		switch(item.type)
		{
		   case 'reward_card':
		   	cardid   = item.card.card_detail_id;
		   	cardgold = item.card.gold;
		   	if($cardLst.find(card => card.id === cardid && card.gold === cardgold) === undefined)
		   	{
		   		dataCardName  = nameinfo.find(data => data.id === cardid); // On cherche le nom de la carte
		   		if(cardgold)
		   		{
		   			cardName = encodeURL(dataCardName.name)+"_lv1_gold.png"; // On creer l'url de l'image
		   		}
		   		else
		   		{
		   			cardName = encodeURL(dataCardName.name)+"_lv1.png"; // On creer l'url de l'image
		   		}
		   		dataCardPrice = prices.find(data => data.card_detail_id === cardid && data.gold === cardgold); // On cherche le prix de la carte
		   		$cardLst.push({ id : cardid, img : cardName, qt : 1, rarity : dataCardName.rarity, gold : cardgold, price : dataCardPrice.low_price});
		   	}
		   	else
		   	{
		   		objId = $cardLst.findIndex((card => card.id === cardid));
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
		}
	});

	imgbonus = "";
	$value   = "";

	// Mise en page

	if($dec > 0)
		$("#card_view").append("<div class='w3-display-container' style='min-width:200px; width:200px; min-height:314px'><img width='175px' class='w3-display-middle' src='https://d36mxiodymuqjm.cloudfront.net/website/icons/img_dec_fx_256.png'><b class='w3-xlarge w3-display-topmiddle'>DEC(s) <i class='fas fa-times'></i> "+$dec+"</b></div>");

	if($popoLeg > 0)
		$("#card_view").append("<div class='w3-display-container' style='min-width:200px; width:200px; min-height:314px'><img width='175px' class='w3-display-middle' src='https://d36mxiodymuqjm.cloudfront.net/website/icons/icon_potion_legendary.png'><b class='w3-xlarge w3-display-topmiddle'> Legendary(s)<i class='fas fa-times'></i> "+$popoLeg+"</b></div>");

	if($popoAlc > 0)
		$("#card_view").append("<div class='w3-display-container' style='min-width:200px; width:200px; min-height:314px'><img width='175px' class='w3-display-middle' src='https://d36mxiodymuqjm.cloudfront.net/website/icons/icon_potion_alchemy.png'><b class='w3-xlarge w3-display-topmiddle'> Alchemy(s)<i class='fas fa-times'></i> "+$popoAlc+"</b></div>");

	if($credit > 0)
		$("#card_view").append("<div class='w3-display-container' style='min-width:200px; width:200px; min-height:314px'><img width='175px' class='w3-display-middle' src='https://d36mxiodymuqjm.cloudfront.net/website/ui_elements/shop/img_credits.png'><b class='w3-xlarge w3-display-topmiddle'> Credit(s)<i class='fas fa-times'></i> "+$credit+"</b></div>");

	$value = ($dec*$decPrice)+($credit/1000)+($popoLeg*0.04)+($popoAlc*0.05);

	$cardLst.forEach(function(card)
	{
		$value = $value+(card.qt*card.price);
		if(card.qt > 1)
		{
			$qt = "<img src='https://d36mxiodymuqjm.cloudfront.net/website/qty-banner.png' class='w3-display-topright' style='max-height:60px;'><b class='w3-xlarge w3-display-topright w3-margin-right'>"+card.qt+"</b>";
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
		   	imgbonus = "<img src='https://d36mxiodymuqjm.cloudfront.net/website/rarity-display_2.png' width='200px;'>";
		   break;
		   case 3:
		   	imgbonus = "<img src='https://d36mxiodymuqjm.cloudfront.net/website/rarity-display_3.png' width='200px;'>";
		   break;
		   case 4:
		   	imgbonus = "<img src='https://d36mxiodymuqjm.cloudfront.net/website/rarity-display_4.png' width='200px;'>";
		   break;
		}

		$("#card_view").append("<div class='w3-display-container' style='min-width:200px; width:200px; min-height:314px'>"+imgbonus+"<img width='190px;' src='"+$url+card.img+"' class='w3-display-topmiddle'>"+$qt+"</div>");
	});
	$("#spin").addClass(" w3-hide");
	$("#card_view").append("<div class='w3-display-container w3-leftbar w3-border-red' style='min-width:200px; width:200px; min-height:314px'><b class='w3-display-topmiddle w3-xlarge'>Chest(s) <i class='fas fa-times'></i> "+$coffre+"</b><img width='190px;' src='https://d36mxiodymuqjm.cloudfront.net/website/misc/loot-chest_open_250.png' class='w3-display-middle'><p class='w3-display-bottommiddle w3-xlarge'>(<b>"+$value.toFixed(2)+"</b><i class='fas fa-dollar-sign'></i>)</p></div>");
}