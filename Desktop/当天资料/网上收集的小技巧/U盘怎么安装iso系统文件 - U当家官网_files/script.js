function addfav()
{
	title = "U当家-www.udangjia.com";
	url = "http://www.uqiwang.com/";
	if(window.sidebar){
			window.sidebar.addPanel(title,url,'');
		}else{
			try{
				window.external.AddFavorite(url,title);
			}catch(e){
				alert("您的浏览器不支持该功能,请使用Ctrl+D收藏本页");
			}
	}
}

function addtxt(title)
{
	title = title;
	url = location.href;
	if(window.sidebar){
			window.sidebar.addPanel(title,url,'');
		}else{
			try{
				window.external.AddFavorite(url,title);
			}catch(e){
				alert("您的浏览器不支持该功能,请使用Ctrl+D收藏本页");
			}
	}	
}


function NewClick(id)
{
	$.post('/ajax/click.php?action=click&id='+id, function(response)																																																		  	{
		document.getElementById("nclick").innerHTML=response;
	});
}



function closetop()
{
	//document.getElementById("video").style.display="none";
	$("#video").fadeOut(800, function () {
			$("#video").remove();
		});	
}