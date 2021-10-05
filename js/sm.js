$limit = 1;
$url   = "https://d36mxiodymuqjm.cloudfront.net/cards_by_level/reward/";


$.ajax( // Prix de vente des cartes rewards
{
	url: 'https://game-api.splinterlands.com/market/for_sale_grouped/',
	dataType: 'json',
	type : 'GET',
	success: function(datas)
	{
		prices = datas.filter(obj => obj.edition == 3);
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
	}
});

function encodeURL(str)
{
	return encodeURIComponent(str).replace(/[!'()*]/g, function(c)
	{
   	return '%' + c.charCodeAt(0).toString(16);
  	});
}

function Sexify()
{
	$("#spin").removeClass(" w3-hide");
	event.preventDefault();
   if($("input").first().val() !== "")
   {
  		$pseudo = $("input").first().val();
  		$.ajax( // Nombre de DEC dans la reward pool
		{
			url: 'https://api.steemmonsters.io/players/history?username='+$pseudo+'&types=claim_reward&limit='+$limit,
			dataType: 'json',
			type : 'GET',
			success: function(datas)
			{
				Sexify_step2(datas);
			}
		});
   }
};

function Sexify_step2(d)
{
	$datadecode = JSON.parse(d[0].result);
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

	// Reset

	$("div.w3-quarter").removeClass(" w3-grayscale-max");
	$("div.w3-quarter > b").html("");
	$("#card_view").html("");
	imgbonus = "";
	$value   = "";

	// Mise en page

	if($dec > 0)
		$("#nbr_dec").html("<i class='fas fa-times'></i> "+$dec);
	else
		$("#nbr_dec").parent().addClass(" w3-grayscale-max");

	if($popoLeg > 0)
		$("#nbr_leg").html("<i class='fas fa-times'></i> "+$popoLeg);
	else
		$("#nbr_leg").parent().addClass(" w3-grayscale-max");

	if($popoAlc > 0)
		$("#nbr_alc").html("<i class='fas fa-times'></i> "+$popoAlc);
	else
		$("#nbr_alc").parent().addClass(" w3-grayscale-max");

	if($credit > 0)
		$("#nbr_cre").html("<i class='fas fa-times'></i> "+$credit);
	else
		$("#nbr_cre").parent().addClass(" w3-grayscale-max");

	$value = ($dec*$decPrice)+($credit/1000)+($popoLeg*0.04)+($popoAlc*0.05);

	$cardLst.forEach(function(card)
	{
		$value = $value+(card.qt*card.price);
		if(card.qt > 1)
		{
			$qt = "<i class='fas fa-times'></i> "+card.qt;
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

		$("#card_view").append("<div class='w3-col s2'><div class='w3-display-container' style='min-width:200px; min-height:314px'>"+imgbonus+"<img width='190px;' src='"+$url+card.img+"' class='w3-display-topmiddle'><b style='writing-mode: vertical-rl; text-orientation: sideways-left;' class='w3-xlarge w3-display-right'>"+$qt+"</b></div></div>");
	});
	$("#spin").addClass(" w3-hide");
	$("#popoNco").removeClass(" w3-hide");
	$("#popoNco").append("<div class='w3-center w3-xxlarge'>Soit, <b>"+$coffre+"</b> coffre(s) pour une valeur de : <b>"+$value.toFixed(2)+"</b>$</div>");
	console.log($value+"$");
}
