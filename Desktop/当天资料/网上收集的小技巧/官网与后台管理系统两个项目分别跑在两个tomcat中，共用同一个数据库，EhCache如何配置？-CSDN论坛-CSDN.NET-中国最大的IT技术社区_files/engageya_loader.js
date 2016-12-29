var _ENGAGEYA_WIDGETS = _ENGAGEYA_WIDGETS || [];
var ENGAGEYA = function(obj)
{
	this.widget_wrapper_elm_id = obj.wwei; // widget wrapper element ID
	this.pid = obj.pid ? obj.pid : ""; // pid, mandatory if using non index services ( exts )
	this.subid = obj.subid ? obj.subid : ""; // subid - optional
	this.publisher_id = obj.pubid ? obj.pubid : ""; // publisher ID 
	this.website_id = obj.webid ? obj.webid : ""; // website ID 
	this.widget_id = obj.wid ? obj.wid : ""; // widget ID
	this.width = obj.width || ""; // player width - optional
	this.height = obj.height || ""; // player height - optional
	this.plr_elm_id = obj.plreid; // player element id - mandatory
	this.plr_type = obj.plrtid || -1; // player type - mandatory
	this.show_on_pause = obj.issop ? obj.issop : 0; // is show widget when user pauses video, default is 0
	this.show_on_complete = obj.issoc ? obj.issoc : 0; // is show widget on video complete, default is 0
	this.show_on_idle = obj.issoi ? obj.issoi : 0; // is show widget on video idle, default is 0
	this.is_index_page = obj.isidx ? obj.isidx : 1; // is index page, default is 0
	this.is_widget_autorun = obj.isar ? obj.isar : 0; // is widget autorun, good for inner recs, default is 0
	this.is_video_widget = obj.isvw ? obj.isvw : 0; // widget can be video and regular
	this.plr_wmode = obj.pwmd ? obj.pwmd : "opaque"; // wmode sets the player mode ( opaque means we can have overlay on top of it - this is to solve flash issue which is always on top )
	this.plr_func_name = obj.pfn; // this is mandatory when using generic player ( when not setting player type id ) 
	this.input_url = obj.iurl || null; 
	this.feed_url = "ext1-api.goingnative.cn/gas-api/feed.json";
	this.recs_url = "recs.goingnative.cn/rec-api/getrecs.json";
	this.recs_url_premium = "premium.goingnative.cn/rec-api/getrecs.json";
	this.event_url = "recs.goingnative.cn/rec-api/event.json";
	this.default_imgs_url = "widget.goingnative.cn/img/def/";
	this.aws_images_url = "//engageya-eu-images9.s3-website-eu-west-1.amazonaws.com";
	this.cdn_images_url = "//images9.goingnative.cn";
	this.default_video_post_btn = "widget.goingnative.cn/img/vplay.png";
	this.doc_ready_called = false;
	this.random_id = Math.ceil((Math.random()*100000000000000000));
	this.cb = "engageya_cb_" + this.random_id;
	this.num_of_slides = obj.tnos || 15;
	this.min_slides = 2;
	this.jq = null;
	this.num_of_jq_attempts = 20;
	this.find_wrapper_elm_retries = 10;
	this.widget_idx = 0;
	this.isNoConflictJquery = obj.ncjqry || false;
	this.scripts_elms = [];
	this.get_recs_states = [[],
					['BUFFERING','PLAYING'], //jwplayer load recs state
					[0,2,3], //flowplayer load recs state
					[1] //generic load recs state
					];
	this.rec_types = ["all","eng_inner","eng_ads","eng_outer"];				
	this.widget_wrapper_elm = null;
	this.widget_add_data = null; // widget additional data
	this.is_widget_wrapper_dom_ready = false;
	this.is_user_initiated_event = false;
	this.data_json = null;
	this.is_real_imps_called = false;
	this.visible_posts_and_types = [];
	this.load_time_start =  (new Date()).getTime();
	this.widget_direction = "left";
	this.widget_op_direction = "right";
	this.click_pixels = obj.cpxls ? obj.cpxls : "";
	this.premium_pub_ids = [158041];
	this.max_num_of_image_load_retries = 6;
	this.image_load_retries_arr = {};
};
		
ENGAGEYA.prototype.run = function ()
{
	if (this.is_video_widget == 1) // video
	{
		this.attach_player_events();
	}
	else // regular
	{
		this.start_run();
	}
}
ENGAGEYA.prototype.attach_player_events = function ()
{
	if (this.plr_type == 1) //jwplayer
	{
		this.attach_jwplayer_events();
	}
	else if (this.plr_type == 2) //flowplayer
	{
		this.attach_flowplayer_events();
	}
	else // generic player
	{
		this.attach_generic_player_events();
	}
	if (this.is_widget_autorun == 1) this.start_run();
	
}
ENGAGEYA.prototype.attach_jwplayer_events = function ()
{
	var currentObj = this;
	jwplayer(this.plr_elm_id).onPlay(function (){currentObj.on_play_action()});
	jwplayer(this.plr_elm_id).onBuffer(function (){currentObj.on_play_action()});
	jwplayer(this.plr_elm_id).onPause(function (){currentObj.on_pause_action()});
	jwplayer(this.plr_elm_id).onIdle(function (){currentObj.on_idle_action()});
	jwplayer(this.plr_elm_id).onComplete(function (){currentObj.on_complete_action()});
	this.plr_get_state_fnc = jwplayer(this.plr_elm_id).getState;
	this.state_events();
	
}
ENGAGEYA.prototype.attach_flowplayer_events = function ()
{
	var currentObj = this;
	var currentPlr = null;
	if (flowplayer(this.plr_elm_id))
	{
		currentPlr = flowplayer(this.plr_elm_id);
	}
	else
	{
		currentPlr = flowplayer();
	}
	try
	{
		currentPlr.onStart(function (){currentObj.on_play_action()});
		currentPlr.onLoad(function (){currentObj.on_play_action()});
		currentPlr.getClip().onResume(function (){currentObj.on_play_action()});
		currentPlr.getClip().onPause(function (){currentObj.on_pause_action()});
		currentPlr.getClip().onStop(function (){currentObj.on_pause_action()});
		currentPlr.getClip().onFinish(function (){currentObj.on_complete_action()});
		this.plr_get_state_fnc = currentPlr.getState;
	}
	catch(e)
	{
		currentPlr.bind("load", function(e, api){currentObj.on_play_action()});
		currentPlr.bind("click", function(e, api){currentObj.is_user_initiated_event = true;});
		//currentPlr.bind("progress", function(e, api){currentObj.on_play_action()});
		currentPlr.bind("resume", function(e, api){currentObj.on_play_action()});
		currentPlr.bind("pause", function(e, api)
		{
			if (currentObj.is_user_initiated_event) // show recs only if user initiated the pause.
			{
				currentObj.on_pause_action();
				currentObj.is_user_initiated_event = false;
			}	
		});
		currentPlr.bind("stop", function(e, api){currentObj.on_pause_action()});
		currentPlr.bind("finish", function(e, api){currentObj.on_complete_action()});
		this.plr_get_state_fnc = function (){return 1;}
	}	
	this.state_events();	
}
ENGAGEYA.prototype.attach_generic_player_events = function ()
{
	var currentObj = this;
	try
	{
		var currentPlr = window[this.plr_func_name](this.plr_elm_id);
	}catch(e){}
	currentPlr = currentPlr ? currentPlr : window[this.plr_func_name];
	currentPlr = currentPlr ? currentPlr : document.getElementById(this.plr_elm_id);
	try
	{
		currentPlr.onStart(function (){currentObj.on_play_action()});
	}catch(e){}	
	try
	{	
		currentPlr.onLoad(function (){currentObj.on_play_action()});
	}catch(e){}		
	try
	{	
		currentPlr.onPlaying(function (){currentObj.on_play_action()});
	}catch(e){}	
	try
	{	
		currentPlr.onplay = function (){currentObj.on_play_action()};
	}catch(e){}	
	try
	{	
		currentPlr.onPlay(function (){currentObj.on_play_action()});
	}catch(e){}	
	try
	{	
		currentPlr.onBuffer(function (){currentObj.on_play_action()});
	}catch(e){}	
	try
	{
		currentPlr.onResume(function (){currentObj.on_play_action()});
	}catch(e){}		
	try
	{
		currentPlr.onPause(function (){currentObj.on_pause_action()});
	}catch(e){}		
	try
	{
		currentPlr.onpause = function (){currentObj.on_pause_action()};
	}catch(e){}	
	try
	{
		currentPlr.onStop(function (){currentObj.on_pause_action()});
	}catch(e){}		
	try
	{
		currentPlr.onFinish(function (){currentObj.on_complete_action()});
	}catch(e){}		
	try
	{
		currentPlr.onended = function (){currentObj.on_complete_action()};
	}catch(e){}	
	try
	{
		currentPlr.onComplete(function (){currentObj.on_complete_action()});
	}catch(e){}	
	try
	{
		this.plr_get_state_fnc = currentPlr.getState || function (){return 1;};
	}catch(e){}		
	this.state_events();	
}
ENGAGEYA.prototype.on_play_action = function ()
{
	this.hide_widget(this);
	this.start_run();
}
ENGAGEYA.prototype.on_pause_action = function ()
{
	if (this.show_on_pause == 1 && this.is_widget_wrapper_dom_ready)
	{
		this.show_widget();
	}	
}
ENGAGEYA.prototype.on_idle_action = function ()
{
	this.show_on_idle == 1 ? this.show_widget() : '';
}
ENGAGEYA.prototype.on_complete_action = function ()
{
	this.show_on_complete == 1 ? this.show_widget() : '';
}
ENGAGEYA.prototype.state_events = function()
{
	if (this.is_load_recs_state())
	{
		this.start_run();
	}
}
ENGAGEYA.prototype.is_load_recs_state = function ()
{
	var currentPlayerState = this.plr_get_state_fnc();
	var isLoadRecsState = this.in_array(currentPlayerState,this.get_recs_states[this.plr_type]);
	return isLoadRecsState;
}
ENGAGEYA.prototype.show_widget = function ()
{
	this.jq('#eng_recs_holder_'+this.random_id).fadeIn('slow');
	this.align_widget_elements();
}
ENGAGEYA.prototype.hide_widget = function (callerObj)
{
	try
	{
		this.jq('#eng_recs_holder_'+callerObj.random_id).hide();
	}catch(e){}	
}
ENGAGEYA.prototype.attach_widget_events = function ()
{
	try
	{
		var currentObj = this;
		this.load_real_imps_events();
		this.widget_imgs_events();
		this.widget_clicks_events();
		this.jq('#eng_ww_close_'+this.random_id).click(function (){currentObj.hide_widget(currentObj)});
	}
	catch(e)
	{	
		console.log('ERROR - events:');console.log(e);
	}	
}
ENGAGEYA.prototype.widget_clicks_events = function ()
{
	this.attach_on_click_pixel_event();	
}
ENGAGEYA.prototype.attach_on_click_pixel_event = function ()
{
	var curObj = this;
	if (curObj.click_pixels)
	{
		try
		{
			for (var i=0;i<curObj.click_pixels.length;i++)
			{
				var curPixel = curObj.click_pixels[i];
				var pixelUrls = curPixel.urls.split(";");
				var clickPixels = "";
				for (var j=0;j<pixelUrls.length;j++)
				{
					if (!curPixel.etype || curPixel.etype == 0) // etype: 0 means image pixel, 1 means google event
					{
						clickPixels += '<img src="'+pixelUrls[j]+'" style="display:none;" width="1px" height="1px" />';
					}
					else if (curPixel.etype == 1)
					{
						clickPixels = pixelUrls;
					}
				}
				var recHref = ".eng_widget_href,.eng_m_widget_href";
				if (curPixel.type != 0) // 0 means fire pixel for all rec types, 1 for inner, 2 for ads, 3 for outer
				{
					var pixelRecType = curObj.rec_types[curPixel.type]; // 
					recHref = ".eng_widget_href."+pixelRecType+",.eng_m_widget_href."+pixelRecType+"";
				}
				if (!curPixel.etype || curPixel.etype == 0)
				{
					curObj.get_recs_holder_elm().find(recHref).mousedown({"pxls":clickPixels},function (e)
					{
						curObj.jq(this).append(e.data.pxls);
					});
				}
				else if (curPixel.etype == 1)
				{
					curObj.get_recs_holder_elm().find(recHref).mousedown({"pxls":clickPixels},function (e)
					{
						try
						{
							var events = e.data.pxls;
							for (var i=0;i<events.length;i++)
							{
								var curEvent = events[i];
								var engClickUrlVals = curEvent.match("engcval_(.*?)['|\"],");	
								if (engClickUrlVals && engClickUrlVals.length > 1)
								{
									var placeHolder =  "engcval_"+engClickUrlVals[1];
									var requestedValue = engClickUrlVals[1];
									var regex = ".*?href=.*?"+requestedValue+"=(.*?)&"
									var valueMatch = this.outerHTML.match(regex);
									if (valueMatch && valueMatch[1])
									{
										var finalValue = decodeURIComponent(valueMatch[1]);
										curEvent = curEvent.replace(placeHolder,finalValue);
									}									
								}
								ga('send', curEvent);
							}
						}catch(e)
						{
							console.log("ERROR - ga click event");console.log(e);
						}	
					});
				}
			}	
		}
		catch(e)
		{
			console.log("ERROR - click pixel");console.log(e);
		}	
	}	
}
ENGAGEYA.prototype.widget_imgs_events = function ()
{
	this.attach_on_img_error_event();
	this.attach_on_hover_brand_img_event();
}
ENGAGEYA.prototype.attach_on_hover_brand_img_event = function ()
{
	var curObj = this;
	var brandingObj = this.get_add_data("brnd");
	if (brandingObj && brandingObj.imghvr)
	{
		curObj.get_recs_holder_elm().hover(function()
		{		
			curObj.jq(this).find('#eng_brnd_img_'+curObj.widget_id).attr("src",brandingObj.imghvr)
		},function() {
			curObj.jq(this).find('#eng_brnd_img_'+curObj.widget_id).attr("src",brandingObj.img.src)
		});
	}
	if (brandingObj && brandingObj.img2hvr)
	{
		curObj.get_recs_holder_elm().hover(function()
		{		
			curObj.jq(this).find('#eng_brnd_img2_'+curObj.widget_id).attr("src",brandingObj.img2hvr)
		},function() {
			curObj.jq(this).find('#eng_brnd_img2_'+curObj.widget_id).attr("src",brandingObj.img2.src)
		});
	}
}
ENGAGEYA.prototype.attach_on_img_error_event = function ()
{
	var curObj = this;
	curObj.get_recs_holder_elm().find(".eng_widget_img,.eng_m_widget_img").error(function ()
	{
		try
		{
			var imgIdx = this.outerHTML.match(".*?_img_(.*?)_.*")[1] * 1;
			var numOfImgLoadRetries = curObj.image_load_retries_arr[imgIdx];
			if (typeof(numOfImgLoadRetries) == "undefined")
			{
				numOfImgLoadRetries = curObj.max_num_of_image_load_retries;
				curObj.image_load_retries_arr[imgIdx] = numOfImgLoadRetries;
			}
			if (numOfImgLoadRetries < 1)
			{
				curObj.set_default_image(curObj,this);
			}
			else
			{
				curObj.image_load_retries_arr[imgIdx]--;
				var imgPath = this.src.match(".*?\/\/.*?(\/.*)")[1];
				var newImageUrl = "";
				if (curObj.image_load_retries_arr[imgIdx]%2 == 0)
				{
					newImageUrl = curObj.aws_images_url+imgPath;
				}
				else
				{
					newImageUrl = curObj.cdn_images_url+imgPath;
				}
				var imgObj = this;
				window.setTimeout(function (){imgObj.src = newImageUrl+ '?' + +new Date;},300);
			}	
		}
		catch(e)
		{
			console.log("ERROR:");console.log(e);
			curObj.set_default_image(curObj,this);
		}	
	});
	curObj.get_recs_holder_elm().find(".eng_widget_img,.eng_m_widget_img").load(function ()
	{
		var imgIdx = this.outerHTML.match(".*?_img_(.*?)_.*")[1] * 1;
		curObj.jq(this).unbind("error");
	});

}
ENGAGEYA.prototype.set_default_image = function (widgetObj,imgObj)
{
	var idx = Math.floor((Math.random() * 3) + 1);
	var imgUrl = widgetObj.custom_default_image || "//"+widgetObj.default_imgs_url+"def_"+idx+".jpg";
	widgetObj.jq(imgObj).unbind("error").attr("src", imgUrl);
}
ENGAGEYA.prototype.start_run = function ()
{
	if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive")
	{
		this.doc_ready(this);
	}
	else
	{
		this.inj_init_binding(this);
	}
}
ENGAGEYA.prototype.doc_ready = function (obj)
{
	if (obj.doc_ready_called) return;
	obj.doc_ready_called = true;
	obj.load_jQuery();
	obj.validate_jquery_loaded(this);
}
ENGAGEYA.prototype.validate_jquery_loaded = function (obj)
{
	if (!obj.jq) 
	{
		if (window.jQuery)
		{	
			obj.jq = window.jQuery;
			if (obj.isNoConflictJquery)
			{
				jQuery.noConflict();
			}
			obj.inner_run();
		}
		else
		{
			obj.num_of_jq_attempts--;
			if (obj.num_of_jq_attempts > 0)
			{
				window.setTimeout(function (){obj.validate_jquery_loaded(obj)},100);
				return;
			}
		}	
	}
	else 
	{
		obj.inner_run();
	}

}
ENGAGEYA.prototype.load_jQuery = function ()
{
	if (window.jQuery)
	{
		this.jq = window.jQuery;
	}
	else
	{
		this.append_script_to_head("//widget.goingnative.cn/jquery.min.js","");
	}
}
ENGAGEYA.prototype.inner_run = function (obj)
{
	var thisObj = obj || this;
	window[thisObj.cb] = function (data)
	{
		if (data && data.recs.length > 0) // currently identifying the caller with widget id, should be with response of random_id instead
		{
			var callerObj = null;
			var isWidgetFound = false;
			for (var i=0;i<_ENGAGEYA_WIDGETS.length;i++)
			{
				if(typeof(data.rndid) != "undefined" && _ENGAGEYA_WIDGETS[i].random_id == data.rndid)
				{
					callerObj = _ENGAGEYA_WIDGETS[i];
					data.widget.id = _ENGAGEYA_WIDGETS[i].widget_id;
					isWidgetFound = true;
					break;
				}
			}
			//fallback after reaplce widget dev, this should be removed in time as shouldn't happen ( 06/08/2015 )
			if (!isWidgetFound)
			{
				for (var i=0;i<_ENGAGEYA_WIDGETS.length;i++)
				{
					if(_ENGAGEYA_WIDGETS[i].widget_id == data.widget.id)
					{
						callerObj = _ENGAGEYA_WIDGETS[i];
						isWidgetFound = true;
						break;
					}
				}
			}
			if (callerObj)
			{
				callerObj.data_json = data;
				callerObj.widget_id = data.widget.id;
				var additionalData = {widget:(data.widget.additionalData || "{}"),network:(data.widget.anad || "{}")};
				callerObj.populate_add_data(additionalData);
				callerObj.populate_widget_data(data);
				callerObj.reposition_widget();
				callerObj.build_layout();
				callerObj.add_player_wmode();
				callerObj.attach_widget_events();
				callerObj.run_criteo();
			}	
		}
	}
	thisObj.widget_wrapper_elm = document.getElementById(thisObj.widget_wrapper_elm_id);
	if (!thisObj.widget_wrapper_elm)
	{
		if (thisObj.find_wrapper_elm_retries > 0)
		{
			thisObj.find_wrapper_elm_retries--;
			window.setTimeout(function (){thisObj.inner_run(thisObj)},50);
			return;
		}
		else
		{
			console.log("INFO: Couldn't find element "+thisObj.widget_wrapper_elm_id);
			return;
		}	
	}
	thisObj.create_placement();
	thisObj.is_widget_wrapper_dom_ready = true;
	var curURL = thisObj.get_page_url();
	var lang = thisObj.get_lang();
	var pageTtl = thisObj.get_page_ttl();
	var pageKwords = thisObj.get_meta_content("keywords","content");
	var docCharset = document.characterSet ? document.characterSet : document.charset;
	var widgetDataUrl = "";
	if (thisObj.is_index_page == 1)
	{
		if (thisObj.is_premium())
		{
			thisObj.recs_url = thisObj.recs_url_premium;
		}
		widgetDataUrl = '//'+thisObj.recs_url+'?cb='+thisObj.cb+'&pubid='+thisObj.publisher_id+'&webid='+thisObj.website_id+'&wid='+thisObj.widget_id+'&recsnum='+thisObj.num_of_slides+'&url='+curURL+'&cs='+docCharset+'&subid='+thisObj.subid+'&title='+pageTtl+'&kwrds='+pageKwords+'&rndid='+thisObj.random_id;
	}
	else
	{
		widgetDataUrl = '//'+thisObj.feed_url+'?cb='+thisObj.cb+'&format=json&action=paid&url='+curURL+'&count='+thisObj.num_of_slides+'&min_count='+thisObj.min_slides+'&is_xpath=0&lang='+lang+'&cs='+docCharset+'&pid='+thisObj.pid+'&subid='+thisObj.subid+'&title='+pageTtl+'&kwrds='+pageKwords;
	}
	thisObj.append_script_to_head(widgetDataUrl,thisObj.random_id);
	_ENGAGEYA_WIDGETS.push(thisObj);
}
ENGAGEYA.prototype.load_real_imps_events = function ()
{
	var widgetJson = this.data_json.widget;
	if (!widgetJson || !widgetJson.isRealImpressions) return;
	function onVisibilityChange(callerObj) 
	{
		return function () 
		{
			var isVisible = callerObj.is_elm_visible(callerObj.widget_wrapper_elm);
			if (isVisible)
			{
				if (!callerObj.is_real_imps_called)
				{
					callerObj.is_real_imps_called = true;
					var widgetData = callerObj.data_json;
					var rIPostsArr = callerObj.visible_posts_and_types;
					if (rIPostsArr.length > 0 )
					{
						var destPostIds = "";
						for (var i=0;i<rIPostsArr.length;i++)
						{
							destPostIds += rIPostsArr[i].pi+":"+rIPostsArr[i].pt;
							if (i != (rIPostsArr.length-1))
							{
								destPostIds += ",";
							}
						}
						var d = new Date();
						var totalLoadTime = d.getTime() - callerObj.load_time_start;
						var imgObj = document.createElement("img");
						imgObj.src = "//"+callerObj.event_url+"?irid="+widgetData.requestId+"&webid="+widgetData.srcWebsiteId+"&wid="+widgetData.srcWidgetId+"&spid="+widgetData.srcPostId+"&tpids="+destPostIds+"&tti="+totalLoadTime+"&ucc="+widgetData.requestGeoCountry;
						try
						{
							document.getElementsByTagName('head')[0].appendChild(imgObj);
						}
						catch(e){console.log('ERROR - real imps:');console.log(e);}	
					}
				}
			}
			return isVisible;
		}
	}
	var handler = onVisibilityChange(this);
	if (window.addEventListener) {
		addEventListener('DOMContentLoaded', handler, false); 
		addEventListener('load', handler, false); 
		addEventListener('scroll', handler, false); 
		addEventListener('resize', handler, false); 
	} else if (window.attachEvent)  {
		attachEvent('onDOMContentLoaded', handler);
		attachEvent('onload', handler);
		attachEvent('onscroll', handler);
		attachEvent('onresize', handler);
	}
}
ENGAGEYA.prototype.run_criteo = function () 
{
	if (this.get_add_data("criteo"))
	{
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.src = '//widget.goingnative.cn/eng_crt_loader.js';
		var h = document.getElementsByTagName('script')[0];
		h.parentNode.insertBefore(s, h);
	}
}
ENGAGEYA.prototype.isShouldBeRTL = function(text)
{
	try
	{
		var rtlChar = /[\u0590-\u083F]|[\u08A0-\u08FF]|[\uFB1D-\uFDFF]|[\uFE70-\uFEFF]/mg;
		var matchedRtlChars = text.match(rtlChar);
		if (!matchedRtlChars) 
		{
		  return false;
		}
	}
	catch(e)
	{
		console.log("ERROR: text direction - "+text);
	}	
	return true;
}
ENGAGEYA.prototype.is_elm_visible = function (elm) 
{
	var rect = elm.getBoundingClientRect();
	var offset = 100;
	try
	{
		return rect.bottom > offset &&
        rect.right > 0 &&
        rect.left < (window.innerWidth || document. documentElement.clientWidth)  &&
        rect.top < (window.innerHeight || document. documentElement.clientHeight)-offset;
	}
	catch(e){return false;}	
}
ENGAGEYA.prototype.is_premium = function () 
{
	try
	{
		var pubId = this.publisher_id;
		var pPIds = this.premium_pub_ids;
		if (pubId && this.in_array(pubId,pPIds))
		{
			return true;
		}
		return false;
	}
	catch(e){return false;}	
}
ENGAGEYA.prototype.populate_widget_data = function(data)
{
	try
	{
		var widget = data.widget;
		var layoutTypeId = widget.layoutTypeId;
		this.widget_img_size = (layoutTypeId == 26) ? 4 : 2;
		this.vertical_widget_img_size = null;
		var jsvls = this.get_add_data("jsvls");
		if (jsvls && jsvls.vcis && this.is_mobile_conditions_satisfied())
		{
			this.vertical_widget_img_size = jsvls.vcis;
		}
		if (this.is_order_by_post_id)
		{
			this.sort_results_by_post_id();
		}
	}
	catch(e){console.log('ERROR - widget data:');console.log(e);}
}
ENGAGEYA.prototype.sort_results_by_post_id = function()
{
	var sourceWebsiteId = this.data_json.srcWebsiteId;
	var recsCopyJson = this.jq.extend({}, this.data_json.recs);
	var recsCopyArr = [];
	for (var key in recsCopyJson)
	{
		if (recsCopyJson[key].partner_id == sourceWebsiteId) // remove what is not inner recommendation
		{
			recsCopyArr.push(recsCopyJson[key]);
		}
	}
	recsCopyArr.sort(function(a, b)
	{
		return b.postId - a.postId;
	});
	
	for (var i=0;i<this.data_json.recs.length;i++)
	{
		var recWebsiteId = this.data_json.recs[i].partner_id;
		if (recWebsiteId == sourceWebsiteId && recsCopyArr[i])
		{
			this.data_json.recs[i] = recsCopyArr[i];
		}
	}
}
ENGAGEYA.prototype.reposition_widget = function()
{
	if (this.widget_wrapper_positioning_obj)
	{
		var elm = this.widget_wrapper_positioning_obj.elm;
		var type = this.widget_wrapper_positioning_obj.type;
		if (this.jq(elm).length > 0)
		{
			var origWrapper = this.jq(this.widget_wrapper_elm).detach();
			switch (type) 
			{
				case 0:
					origWrapper.appendTo(elm);
					break;
				case 1:
					origWrapper.prependTo(elm);
					break;
				case 2:
					origWrapper.insertAfter(elm);
					break;
				case 3:
					origWrapper.insertBefore(elm);
					break;	
				default:
					origWrapper.appendTo(elm);
					break;			
			}
			this.width = null;
			this.calculate_widget_wrapper_dims();
		}
	}
}
ENGAGEYA.prototype.populate_add_data = function(addData)
{
	try
	{
		var widgetData = JSON.parse(addData.widget.replace(/\[rid\]/g,this.random_id));
		var networkData = JSON.parse(addData.network.replace(/\[rid\]/g,this.random_id));
		if (!widgetData.brnd && networkData && networkData.brnd)
		{
			widgetData.brnd = networkData.brnd;
		}
		this.widget_add_data = widgetData;
		var jcss = this.widget_add_data.jcss || {};
		var jsvls = this.widget_add_data.jsvls || {};
		this.slide_height = jcss.sh || (this.is_video_widget ? 150 : 115);
		this.slide_width = jcss.sw || (this.is_video_widget ? 200 : 140);
		this.slide_horz_margin = jcss.shm || 10;
		this.widget_lpadding = jcss.wlp || (this.is_video_widget ? 15 : 0);
		this.widget_rpadding = jcss.wrp || (this.is_video_widget ? 15 : 0);
		this.widget_rmargin = jcss.wrm || (this.is_video_widget ? 2 : 0);
		this.widget_lmargin = jcss.wlm || (this.is_video_widget ? 2 : 0);
		this.slides_wrapper_lpadding = jcss.swlp || 0;
		this.slides_wrapper_rpadding = jcss.swrp || 0;
		this.slides_wrapper_lmargin = jcss.swlm || 0;
		this.slides_wrapper_rmargin = jcss.swrm || 0;
		this.slide_bpadding = jcss.sbp || (this.is_video_widget ? 15 : 5);
		this.slide_tpadding = jcss.stp || (this.is_video_widget ? 15 : 5);
		this.widget_txt_direction = jcss.wtdir || null;
		this.widget_img_size = jsvls.cis || 2;
		this.num_of_slides_a_row = jsvls.spr || (this.is_video_widget ? 3 : null);	
		this.num_of_mobile_slides_a_row = jsvls.mspr || (this.is_video_widget ? 3 : null); // this used when we open horizontal layout for mobile
		this.is_cancel_click_bubble = jsvls.iccb || false; 
		this.max_width_for_mobile = jsvls.mwfm || 420; // max width for calling mobile widget
		this.is_vertical_mobile_widget = (typeof jsvls.ivmw != "undefined" && jsvls.ivmw == 0) ? false : true; // this checks if the vertical mobile layout should be called 
		this.is_force_vertical_layout = jsvls.ifvl || false;
		this.num_of_mobile_slides = jsvls.noms || 6; // this defines the number of mobile slides
		this.is_default_brand = (!this.website_id || this.website_id < 127432) ? jsvls.isdb : ((typeof jsvls.isdb != "undefined" && jsvls.isdb == 0) ? false : true);
		this.title_elm_type = jsvls.ttlelm ? jsvls.ttlelm : "div";
		this.width = (jsvls.rplcwidth && jsvls.rplcwidthval && jsvls.rplcwidth == Math.floor(this.width)) ? jsvls.rplcwidthval : this.width;
		this.widget_wrapper_positioning_obj = jsvls.wwpo ? jsvls.wwpo : null;
		this.max_width_for_tablet_cls = jsvls.mwftc || null;
		this.image_size_for_rec_num = jsvls.cisfrm || null;
		this.is_order_by_post_id = jsvls.iobpi || null;
		this.custom_default_image = jsvls.cdi || null;
		this.is_description_span = jsvls.idesc || null;
		this.is_links_open_new_window = jsvls.inw || null;
		this.max_description_chars = jsvls.mdc || 1000;
		this.max_mobile_description_chars = jsvls.mmdc || 1000;
	}
	catch(e){console.log('ERROR - additional data:');console.log(e);}
}
ENGAGEYA.prototype.get_add_data = function (name)
{
	if (this.widget_add_data && this.widget_add_data[name])
		return this.widget_add_data[name];
	return null;	
}
ENGAGEYA.prototype.set_add_data = function (name,value)
{
	this.widget_add_data[name] = value;
}
ENGAGEYA.prototype.add_player_wmode = function ()
{
	// not implemented for now
}
ENGAGEYA.prototype.get_page_url = function ()
{
	if (this.input_url) 
	{
		return this.input_url;
	}	
	var pUrl = document.location.href;
	if (this.is_in_iframe())
	{
		pUrl = document.referrer ? document.referrer : pUrl;
	}
	pUrl = encodeURIComponent(pUrl);
	return pUrl;
}
ENGAGEYA.prototype.get_total_slides = function (widgetRows,totalReturnedSlides)
{
	var totalRequestedSlides = this.num_of_slides_a_row * widgetRows;
	var finalSlideCount = totalRequestedSlides;
	while(finalSlideCount > totalReturnedSlides && widgetRows > 1)
	{
		widgetRows--;
		finalSlideCount = this.num_of_slides_a_row * widgetRows;
	}
	if (this.is_mobile_conditions_satisfied())
	{
		finalSlideCount = this.num_of_mobile_slides ? this.num_of_mobile_slides : finalSlideCount;
	}
	finalSlideCount = finalSlideCount > totalReturnedSlides ? totalReturnedSlides : finalSlideCount;
	return finalSlideCount;
}
ENGAGEYA.prototype.build_layout = function ()
{
	if(((this.is_vertical_mobile_widget == true) && this.is_mobile_conditions_satisfied()) || this.is_force_vertical_layout)
	{
		this.build_vertical_layout();
	}
	else
	{
		this.build_horizontal_layout();
	}
}
ENGAGEYA.prototype.is_mobile_conditions_satisfied = function ()
{
	if (!this.is_video_widget && this.is_mobile() && this.width < this.max_width_for_mobile)
	{
		return true;
	}	
	return false;	
}
ENGAGEYA.prototype.build_vertical_layout = function ()
{
	var data = this.data_json;
	var totalSlides = Math.min(this.num_of_mobile_slides,data.recs.length);
	var recsHolderElm = this.get_recs_holder_elm();
	var widgetWrapperId = 'eng_m_top_ww_widget_'+this.random_id;
	var tabletCls = this.get_tablet_cls();
	var deviceOS = this.get_mobile_device_OS();
	var deviceOSCls = deviceOS ? "_"+deviceOS : "";
	var widgetWrapper = '<div class="eng_m_top_ww_widget'+deviceOSCls+tabletCls+'" id="'+widgetWrapperId+'"><div class="eng_m_ww_widget" id="eng_m_ww_widget_'+this.widget_id+'">';
	this.populate_widget_directions();
	var layout_default_css = this.get_default_css("MOBILE_VERTICAL",widgetWrapperId);		
	var widgetHeader = '<'+this.title_elm_type+' class="eng_m_ww_title" id="eng_m_ww_title_'+this.random_id+'"><span class="eng_m_ww_ttl_span1">'+data.widget.headerText+'</span><span class="eng_m_ww_ttl_span2"></span></'+this.title_elm_type+'>';
	var allSlidesWrapper = '<div class="eng_m_asw" id="eng_m_asw_'+this.random_id+'">';
	widgetWrapper += widgetHeader + allSlidesWrapper;
	var recs = data.recs;
	var impressionPixels = "";
	for (var i=0;i<totalSlides;i++)
	{
		var postId = recs[i].postId;
		var postType = recs[i].recTypeDB;
		var displayName = this.get_display_name(recs[i]);
		this.visible_posts_and_types.push({pi:postId,pt:postType});
		var videoPostCls = this.is_video_post(recs[i]) ? " eng_m_widget_vsw" : "";
		var slideWrapper = '<div id="eng_m_sw_'+i+'_'+this.widget_id+'" class="eng_m_widget_sw'+videoPostCls+'">';
		var recType = this.get_rec_type(recs[i]);
		var slideHref = '<a id="eng_m_href_'+i+'_'+this.widget_id+'" class="eng_m_widget_href '+recType+'" ';
	    var slideImg = '<div id="eng_m_img_w_'+i+'_'+this.widget_id+'" class="eng_m_widget_img_w"><img id="eng_m_img_'+i+'_'+this.widget_id+'" class="eng_m_widget_img" ';
		var shortenTitle = this.is_video_widget ? this.shorten(recs[i].title,50) : this.shorten(recs[i].title,150);
		var description = this.get_description(recs[i]);
		var directionStyle = "";
		if (this.widget_txt_direction == "rtl" && !this.isShouldBeRTL(shortenTitle))
		{
			directionStyle = 'style="direction:ltr;text-align:left;"';
		}
		var innerDiv = '<div id="eng_m_in_'+i+'_'+this.widget_id+'" class="eng_m_widget_in" '+directionStyle+'>';
		var innerSpan = '<span id="eng_m_is_'+i+'_'+this.widget_id+'" class="eng_m_widget_is">';
		var innerSpanDesc = this.is_description_span ? '<span id="eng_m_isd_'+i+'_'+this.widget_id+'" class="eng_m_widget_isd">' + description + '</span>' : "";
		var displayNameSpan = displayName ? '<span id="eng_m_dn_'+i+'_'+this.widget_id+'" class="eng_m_widget_dn">' : "";
		slideHref += this.get_click_defs(recs[i],data.srcWebsiteId);
		var imgSrc = this.get_thumb(data, recs[i].thumbnail_path, recs[i].category_id, i+1);
		slideImg += 'src="'+imgSrc+'" data-pin-no-hover="true" /></div>';
		innerSpan += shortenTitle + '</span>';
		displayNameSpan += displayName ? (displayName + '</span>') : "";
		slideWrapper += slideHref + slideImg + innerDiv + innerSpan + innerSpanDesc + displayNameSpan;
		slideWrapper += '</div></a></div>';
		widgetWrapper += slideWrapper;
		widgetWrapper += this.add_row_if_required(i+1, this.num_of_slides_a_row, totalSlides);
		impressionPixels += this.get_impression_pixel_imgs(data.recs[i].impressionUrls);
	}
	var brandingObj = this.get_widget_branding();
	widgetWrapper += '</div><div id="eng_m_brnd_'+this.widget_id+'" class="eng_m_branding">'+brandingObj+'</div></div>';
	widgetWrapper += impressionPixels + '</div>';
	var addDataCss = this.get_add_data("css") || "";
	widgetCss = '<style>'+layout_default_css+addDataCss+'</style>';
	recsHolderElm.html(widgetCss+widgetWrapper);
}	
ENGAGEYA.prototype.build_horizontal_layout = function ()
{
	var data = this.data_json;
	this.calc_slides_dims();
	var widgetRows = data.widget.displayRows;
	var totalSlides = this.get_total_slides(widgetRows,data.recs.length);
	var recsHolderElm = this.get_recs_holder_elm();
	var mobileId = this.is_mobile_conditions_satisfied() ? "m_" : "";
	var widgetWrapperId = 'eng_'+mobileId+'top_ww_widget_'+this.random_id;
	var tabletCls = this.get_tablet_cls();
	var widgetWrapper = '<div class="eng_top_ww_widget'+tabletCls+'" id="'+widgetWrapperId+'"><div class="eng_ww_widget" id="eng_ww_widget_'+this.widget_id+'">';
	this.populate_widget_directions();
	var videoCSS = this.get_default_css("DESKTOP_VIDEO",widgetWrapperId);
	var nonVideoCSS = this.get_default_css("DESKTOP_NON_VIDEO",widgetWrapperId);
	var layout_default_css = this.get_default_css("DESKTOP",widgetWrapperId);
	layout_default_css += this.is_video_widget ? videoCSS : nonVideoCSS;	
	var widgetHeader = '<'+this.title_elm_type+' class="eng_ww_title" id="eng_ww_title_'+this.random_id+'"><span class="eng_ww_ttl_span1">'+data.widget.headerText+'</span><span class="eng_ww_ttl_span2"></span></'+this.title_elm_type+'>';
	var widgetCloseBtn = this.is_video_widget ? '<div class="eng_ww_close" id="eng_ww_close_'+this.random_id+'"><span>&times</span></div>' : '';
	var allSlidesWrapper = '<div class="eng_asw" id="eng_asw_'+this.random_id+'">';
	widgetWrapper += widgetHeader + widgetCloseBtn + allSlidesWrapper;
	var recs = data.recs;
	var impressionPixels = "";
	for (var i=0;i<totalSlides;i++)
	{
		var postId = recs[i].postId;
		var postType = recs[i].recTypeDB;
		this.visible_posts_and_types.push({pi:postId,pt:postType});
		if (this.is_start_of_row(i,this.num_of_slides_a_row))
		{
			layout_default_css += '#eng_sw_'+i+'_'+this.widget_id+'{margin-'+this.widget_direction+':0px !important;}';
		}
		var videoPostCls = this.is_video_post(recs[i]) ? " eng_widget_vsw" : "";
		var slideWrapper = '<div id="eng_sw_'+i+'_'+this.widget_id+'" class="eng_widget_sw'+videoPostCls+'">';
		var recType = this.get_rec_type(recs[i]);
		var slideHref = '<a id="eng_href_'+i+'_'+this.widget_id+'" class="eng_widget_href '+recType+'" ';
		var slideImg = '<div id="eng_img_w_'+i+'_'+this.widget_id+'" class="eng_widget_img_w"><img id="eng_img_'+i+'_'+this.widget_id+'" class="eng_widget_img" ';
		var shortenTitle = this.shorten(recs[i].title,100);
		var description = this.get_description(recs[i]);
		var directionStyle = "";
		if (this.widget_txt_direction == "rtl" && !this.isShouldBeRTL(shortenTitle))
		{
			directionStyle = 'style="direction:ltr;text-align:left;"';
		}
		var innerDiv = '<div id="eng_in_'+i+'_'+this.widget_id+'" class="eng_widget_in" '+directionStyle+'>';
		var innerSpan = '<span id="eng_is_'+i+'_'+this.widget_id+'" class="eng_widget_is">';
		var innerSpanDesc = this.is_description_span ? '<span id="eng_isd_'+i+'_'+this.widget_id+'" class="eng_widget_isd">' + description + '</span>' : "";
		var displayName = this.get_display_name(recs[i]);
		var displayNameSpan = displayName ? '<span id="eng_dn_'+i+'_'+this.widget_id+'" class="eng_widget_dn">' : "";
		slideHref += this.get_click_defs(recs[i],data.srcWebsiteId);
		var imgSrc = this.get_thumb(data, recs[i].thumbnail_path, recs[i].category_id, i+1);
		slideImg += 'src="'+imgSrc+'" data-pin-no-hover="true" /></div>';
		innerSpan += shortenTitle + '</span>';
		displayNameSpan += displayName ? (displayName + '</span>') : "";
		slideWrapper += slideHref + slideImg + innerDiv + innerSpan + innerSpanDesc + displayNameSpan;
		slideWrapper += '</div></a></div>';
		widgetWrapper += slideWrapper;
		widgetWrapper += this.add_row_if_required(i+1, this.num_of_slides_a_row, totalSlides);
		impressionPixels += this.get_impression_pixel_imgs(data.recs[i].impressionUrls);
	}
	var brandingObj = this.get_widget_branding();
	widgetWrapper += '</div><div id="eng_brnd_'+this.widget_id+'" class="eng_branding">'+brandingObj+'</div></div>';
	widgetWrapper += impressionPixels + '</div>';	
	var addDataCss = this.get_add_data("css") || "";
	widgetCss = '<style>'+layout_default_css+addDataCss+'</style>';
	recsHolderElm.html(widgetCss+widgetWrapper);
}
ENGAGEYA.prototype.get_default_css = function (type, widgetWrapperId)
{
	var css = "";
	var videoPostDefs = this.get_add_data("vpost");
	var videoPostBtnImage = (videoPostDefs && videoPostDefs.pimg) ? videoPostDefs.pimg : ("//"+this.default_video_post_btn);
	switch (type) 
	{
		case "DESKTOP":
			css = 	"#"+widgetWrapperId+" .eng_top_ww_widget{}"+
					"#"+widgetWrapperId+" .eng_ww_widget{display:inline-block;direction:"+this.widget_txt_direction+";position:relative;margin-bottom:2px;margin-left:"+this.widget_lmargin+"px;margin-right:"+this.widget_rmargin+"px;text-align:center;padding-left:"+this.widget_lpadding+"px;padding-right:"+this.widget_rpadding+"px;padding-top:"+this.slide_tpadding+"px;padding-bottom:"+this.slide_bpadding+"px;}"+
					"#"+widgetWrapperId+" .eng_ww_title{text-align:"+this.widget_direction+";}"+
					"#"+widgetWrapperId+" .eng_ww_close{position:absolute;top:8px;"+this.widget_op_direction+":8px;cursor:pointer;font-size:20px;}"+
					"#"+widgetWrapperId+" .eng_asw{display:block;margin-left:"+this.slides_wrapper_lmargin+"px;margin-right:"+this.slides_wrapper_rmargin+"px;padding-left:"+this.slides_wrapper_lpadding+"px;padding-right:"+this.slides_wrapper_rpadding+"px;}"+
					"#"+widgetWrapperId+" .eng_widget_sw{width:"+this.slide_width+"px;text-align:"+this.widget_direction+";position:relative;display:inline-block;margin-"+this.widget_direction+":"+this.slide_horz_margin+"px;}"+
					"#"+widgetWrapperId+" .eng_widget_in{width:100%;}"+
					"#"+widgetWrapperId+" .eng_widget_is{}"+
					"#"+widgetWrapperId+" .eng_widget_dn{font-size:10px;text-decoration:none !important;display:inline-block;width:100%;}"+
					"#"+widgetWrapperId+" .eng_widget_img{width:100%;height:auto;border-radius:inherit;margin-bottom:5px;}"+
					"#"+widgetWrapperId+" .eng_widget_href{border-radius:inherit;}"+
					"#"+widgetWrapperId+" .eng_rows_seperator{height:10px;}"+
					"#"+widgetWrapperId+" .eng_branding{text-align:"+this.widget_op_direction+";margin:8px 0px 0px 0px;}"+
					"#"+widgetWrapperId+" .eng_branding a{color:#BBB;font-size:12px;font-family:arial;}";
			break;	
		case "DESKTOP_NON_VIDEO":	
			css =	"#"+widgetWrapperId+" .eng_ww_widget{color:#000;}"+
	                "#"+widgetWrapperId+" .eng_widget_sw{vertical-align:top;margin-bottom:10px}"+
					"#"+widgetWrapperId+" .eng_widget_vsw .eng_widget_img_w::after{content:'';background-image: url("+videoPostBtnImage+");position:absolute;left:40%;top:42%;width:35px;height:26px;z-index:2;}"+
					"#"+widgetWrapperId+" .eng_widget_href{position:relative;display:block !important;visibility:visible !important;}"+
					"#"+widgetWrapperId+" .eng_widget_in{width:100%;line-height:1.4;}"+
					"#"+widgetWrapperId+" .eng_widget_dn{color:#CDCDCD;}"+
					"#"+widgetWrapperId+" .eng_ww_title{padding:0px;margin:0px 0px 5px 0px;}"+	
					"#"+widgetWrapperId+" .eng_ww_ttl_span1{display:block;padding:5px 0px;float:none !important;}"+	
					"#"+widgetWrapperId+" .eng_widget_img_w{position:relative;}"+
					"#"+widgetWrapperId+" .eng_widget_img{margin-bottom:5px;display:block;}";
			break;		
		case "DESKTOP_VIDEO":	
			css =	"#"+widgetWrapperId+" .eng_ww_widget{background-color:rgba(1, 1, 1, 0.9);color:#FFF;}"+
				    "#"+widgetWrapperId+" .eng_widget_in{position:absolute;background-color:rgba(36,36,36,0.8);color:#FFF;font-size:12px;line-height:normal !important;bottom:0px;}"+
				    "#"+widgetWrapperId+" .eng_widget_sw{height:"+this.slide_height+"px;}"+
					"#"+widgetWrapperId+" .eng_widget_dn{}"+
				    "#"+widgetWrapperId+" .eng_widget_is{display:block;padding: 2px 5px 2px 5px;}"+
				    "#"+widgetWrapperId+" .eng_ww_title{padding:0px 0px 5px 0px;font-size:15px;}";
			break;	
		case "MOBILE_VERTICAL":
			css =	"#"+widgetWrapperId+" .eng_m_top_ww_widget{}"+
					"#"+widgetWrapperId+" .eng_m_ww_widget{display:inline-block;direction:"+this.widget_txt_direction+";position:relative;margin-bottom:2px;margin-left:"+this.widget_lmargin+"px;margin-right:"+this.widget_rmargin+"px;text-align:center;padding-left:"+this.widget_lpadding+"px;padding-right:"+this.widget_rpadding+"px;padding-top:"+this.slide_tpadding+"px;padding-bottom:"+this.slide_bpadding+"px;}"+
					"#"+widgetWrapperId+" .eng_m_ww_title{padding:0px 0px 5px 0px;text-align:"+this.widget_direction+";}"+
					"#"+widgetWrapperId+" .eng_m_asw{display:block;margin-left:"+this.slides_wrapper_lmargin+"px;margin-right:"+this.slides_wrapper_rmargin+"px;padding-left:"+this.slides_wrapper_lpadding+"px;padding-right:"+this.slides_wrapper_rpadding+"px;}"+
					"#"+widgetWrapperId+" .eng_m_widget_sw{width:100%;padding-bottom:8px;}"+
					"#"+widgetWrapperId+" .eng_m_widget_vsw .eng_m_widget_img_w::after{content:'';background-image: url("+videoPostBtnImage+");position:absolute;"+this.widget_direction+":37%;top:42%;width:35px;height:26px;z-index:2;}"+
					"#"+widgetWrapperId+" .eng_m_widget_in{width:57%;display:inline-block;vertical-align:top;text-align:"+this.widget_direction+";}"+
					"#"+widgetWrapperId+" .eng_m_widget_is{line-height:1.4;}"+
					"#"+widgetWrapperId+" .eng_m_widget_dn{font-size:10px;padding:5px 5px 3px 0px;color:#999999;display:block;}"+
					"#"+widgetWrapperId+" .eng_m_widget_img_w{width:40%;margin-"+this.widget_op_direction+":3%;display:inline-block;position:relative;}"+
					"#"+widgetWrapperId+" .eng_m_widget_img{width:100%;}"+
					"#"+widgetWrapperId+" .eng_m_ww_ttl_span1{display:block;padding:5px 0px;float:none !important;}"+
					"#"+widgetWrapperId+" .eng_m_widget_href{border-radius:inherit;display:block !important;visibility:visible !important;}"+
					"#"+widgetWrapperId+" .eng_m_rows_seperator{height:8px;}"+
					"#"+widgetWrapperId+" .eng_m_branding{text-align:"+this.widget_op_direction+";margin:8px 0px 0px 0px;}"+
					"#"+widgetWrapperId+" .eng_m_branding a{color:#BBB;font-size:12px;font-family:arial;}";
			break;			
	}
	return css;
}
ENGAGEYA.prototype.get_description = function (rec)
{
	if (!rec)
	{
		return;
	}
	var description = rec.description;
	try
	{
		var maxDescriptionChars;
		if (this.is_mobile_conditions_satisfied())
		{
			maxDescriptionChars = this.max_mobile_description_chars;
		}
		else
		{
			maxDescriptionChars = this.max_description_chars;
		}
		if (description && description.length > maxDescriptionChars)
		{
			description = description.replace("...","");
			description = description.trim();
			var lastSpace = description.lastIndexOf(" ");
			description = description.substring(0,lastSpace);
			var lastChar = description.charAt(description.length-1);
			if (lastChar == "," || lastChar == "." || lastChar == "-" || lastChar == "|")
			{
				description = description.substring(0,description.length-1).trim();
			}
			description += "...";
		}
	}
	catch(e)
	{
		console.log('ERROR');console.log(e);
	}
	return description;
}
ENGAGEYA.prototype.get_click_defs = function (rec,sourceWebId)
{
	var hrefTarget = this.get_href_target(rec.partner_id,sourceWebId);
	var cancelBubble = this.get_cancle_click_bubble();
	var onClick = 'onclick="'+cancelBubble+'"';
	var isAsynClick = rec.ajx ? true : false;
	var clickTagPostfix = "";
	var clickURL = rec.clickUrl;
	if (isAsynClick)
	{
		window['ajx_sprk_click'] = function (url){}
		clickTagPostfix += hrefTarget+' href="'+rec.url+'" '+onClick+' title="'+rec.title+'" onmousedown="_eng_do_async_click(\'' + clickURL + '\');'+cancelBubble+'return true;">';
	}
	else
	{
		if (this.is_in_iframe())
		{
			var url = this.get_page_url();
			if (url)
			{
				url = encodeURIComponent(decodeURIComponent(url));
				clickURL = clickURL + "&cr=" + url;
			}	
		}
		clickTagPostfix += hrefTarget+' href="'+rec.url+'" '+onClick+' title="'+rec.title+'" onmousedown="this.href=\''+ clickURL +'\';'+cancelBubble+'return true;">';
	}	
	return clickTagPostfix;
}	
ENGAGEYA.prototype.get_rec_type = function (rec)
{
	var recTypeArr = rec.recType.split("_");
	var recType = "eng_"+recTypeArr[1].toLowerCase();
	return recType;
}
ENGAGEYA.prototype.is_video_post = function (post)
{
	var isVideoPost = false;
	var videoPostDefinitions = this.get_add_data("vpost");
	if (videoPostDefinitions && videoPostDefinitions.drgx)
	{
		isVideoPost = post.url.match(videoPostDefinitions.drgx) != null;
	}
	return isVideoPost;
}

ENGAGEYA.prototype.get_impression_pixel_imgs = function(urls)
{
	var retHtml = "";
	if (urls && urls != null && urls.length > 0)
	{
		for (var i=0;i<urls.length;i++)
		{
			retHtml += '<img src="'+urls[i]+'" style="display:none;" width="1px" height="1px" />';
		}
	}
	return retHtml;
}
ENGAGEYA.prototype.get_display_name = function (rec)
{
	var displayName = "";
	var displayNameRecTypes = [2,3,4,8,18,19,20,21,30];
	var curRecType = rec.recTypeDB*1;
	if (this.in_array(curRecType,displayNameRecTypes))
	{
		displayName = this.shorten(rec.displayName,20);
	}
	return displayName;
}
ENGAGEYA.prototype.populate_widget_directions = function ()
{
	this.widget_txt_direction = this.widget_txt_direction || this.get_recs_holder_elm().css('direction');
	var isRTL = this.widget_txt_direction == "rtl" ? true : false;
	this.widget_direction = isRTL ? "right" : "left"; // widget direction
	this.widget_op_direction = isRTL ? "left" : "right"; // widget opposite direction
}
ENGAGEYA.prototype.get_cancle_click_bubble = function ()
{
	return (this.is_cancel_click_bubble ? "event&&event.cancelBubble&&(event.cancelBubble=true);event&&event.stopPropagation&&(event.stopPropagation());" : "");
}
ENGAGEYA.prototype.get_recs_holder_elm = function ()
{
	return this.jq('#eng_recs_holder_'+this.random_id);
}
ENGAGEYA.prototype.align_widget_elements = function ()
{
	this.align_widget_title();	
}
ENGAGEYA.prototype.get_widget_branding = function ()
{
	var html = "";
	var brandingObj = null;
	var imgHtmlHolder = {img:'',img2:''};
	var jsvls = this.get_add_data("jsvls");
	if (this.is_default_brand)
	{
		var logoImgUrl = '//'+this.default_imgs_url;
		brandingObj = this.get_add_data("brnd") || {href:"//www.engageya.com",name:"",ttl:"Engageya",img:{src:logoImgUrl+'eng_logo.png',width:41,height:12},imghvr:logoImgUrl+'eng_logo_c.png',href2:'',name2:'',ttl2:'',img2:'',img2hvr:''};
		this.set_add_data("brnd",brandingObj);
	}
	else
	{
		brandingObj = this.get_add_data("brnd") || {href:"",name:"",ttl:"",img:'',imghvr:'',adds:'',href2:'',name2:'',ttl2:'',img2:'',adds2:'',img2hvr:''};
	}	
	if (!brandingObj.adds)
	{
		brandingObj.adds = "";
	}
	if (brandingObj.img)
	{
		var imgObj = brandingObj.img;
		imgHtmlHolder.img = '<img id="eng_brnd_img_'+this.widget_id+'" class="eng_brnd_img" src="'+imgObj.src+'" width="'+imgObj.width+'px" height="'+imgObj.height+'px"/>';
	}
	if (brandingObj.img2)
	{
		var imgObj = brandingObj.img2;
		imgHtmlHolder.img2 = '<img id="eng_brnd_img2_'+this.widget_id+'" class="eng_brnd_img2" src="'+imgObj.src+'" width="'+imgObj.width+'px" height="'+imgObj.height+'px"/>';
	}
	if (brandingObj.name || brandingObj.img)
	{
		html = '<a href="'+brandingObj.href+'" '+brandingObj.adds+' target="_blank" title="'+brandingObj.ttl+'">'+brandingObj.name+imgHtmlHolder.img+'</a>'
	}	
	if (brandingObj.name2 || brandingObj.img2)
	{
		brandingObj.href2 = brandingObj.href2 || '';
		brandingObj.ttl2 = brandingObj.ttl2 || '';
		brandingObj.name2 = brandingObj.name2 || '';
		html += '<a href="'+brandingObj.href2+'" '+brandingObj.adds2+' target="_blank" title="'+brandingObj.ttl2+'">'+brandingObj.name2+imgHtmlHolder.img2+'</a>'
	}
	return html;
}
ENGAGEYA.prototype.is_mobile = function ()
{
	try
	{ 
		document.createEvent("TouchEvent"); 
		return true; 
	}
	catch(e)
	{
		return false;
	}
}
ENGAGEYA.prototype.get_tablet_cls = function ()
{
	var tabletCls = "";
	if (this.is_tablet_conditions_satisfied())
	{
		tabletCls = " eng_tablet";
	}
	return tabletCls;
}
ENGAGEYA.prototype.is_tablet_conditions_satisfied = function ()
{
	if (this.is_mobile() && !this.is_mobile_conditions_satisfied() && this.max_width_for_tablet_cls && this.max_width_for_tablet_cls >= this.width)
	{
		return true;
	}
	return false;
}
ENGAGEYA.prototype.get_mobile_device_OS = function ()
{
	var mobileDevice = "";
	if (!(this.is_mobile())) return
	if (navigator.userAgent.match(/Android/i))
	{
		mobileDevice = "android";
	}
    else if (navigator.userAgent.match(/iPhone|iPad|iPod/i))
    {
		mobileDevice = "ios";
	}
	else
	{
		mobileDevice = "other";
	}
	return mobileDevice;
}
ENGAGEYA.prototype.align_widget_title = function ()
{

}
ENGAGEYA.prototype.get_thumb = function (data, thumb, category_id, recNum) 
{
	var lastIndex;
	var size = this.widget_img_size;
	var thumbsTypeCount = 4;
	var imgTypeDelta = 3;
	if (this.vertical_widget_img_size)
	{
		size = this.vertical_widget_img_size;
		thumbsTypeCount = 17;
	}
	if (this.image_size_for_rec_num)
	{
		thumbsTypeCount = 17;
		if (this.image_size_for_rec_num.phone && this.is_mobile_conditions_satisfied())
		{
			for (var i=0;i<this.image_size_for_rec_num.phone.length;i++)
			{
				if (this.image_size_for_rec_num.phone[i][0] == recNum)
				{
					size = this.image_size_for_rec_num.phone[i][1]
				}
			}
		}
		else if (this.image_size_for_rec_num.tablet && this.is_tablet_conditions_satisfied())
		{
			for (var i=0;i<this.image_size_for_rec_num.tablet.length;i++)
			{
				if (this.image_size_for_rec_num.tablet[i][0] == recNum)
				{
					size = this.image_size_for_rec_num.tablet[i][1]
				}
			}
		}
		else if (this.image_size_for_rec_num.desktop)
		{
			for (var i=0;i<this.image_size_for_rec_num.desktop.length;i++)
			{
				if (this.image_size_for_rec_num.desktop[i][0] == recNum)
				{
					size = this.image_size_for_rec_num.desktop[i][1]
				}
			}
		}
	}
	if (thumb) {
		for (var i = 1; i <= thumbsTypeCount; i++) {
			if (i == size) continue;
			lastIndex = thumb.lastIndexOf("_" + i + ".");
			if (lastIndex != -1) {
				if (i>=10)
				{
					imgTypeDelta = 4;
				}
				thumb = thumb.substr(0, lastIndex) + "_" + size + "." + thumb.substr(lastIndex + imgTypeDelta);
				break;
			}
		}
	}
	return thumb;
}
ENGAGEYA.prototype.shorten = function (s, n) 
{
	if (!s) return "";
	var origLength = s.length;
	var cut= s.indexOf(' ', n);
	if (cut == -1) {
		if (origLength <= n)  return s;
		else return s.substring(0, n)+ "...";
	}
	sS = s.substring(0, cut)
	if(sS.length < origLength) sS = sS + "...";
	return sS;
}
ENGAGEYA.prototype.click = function (obj,clickUrl,isAjx)
{
	obj.href = clickUrl; 
	return true;
}
ENGAGEYA.prototype.get_href_target = function (sldWebid,cureWebid) 
{
	var target = '';
	if (sldWebid != cureWebid || this.is_links_open_new_window) 
	{
		target = 'target="_blank"';
	}
	else if (this.is_in_iframe())
	{
		target = 'target="_parent"';
	}
	return target;
}
ENGAGEYA.prototype.is_in_iframe = function ()
{
	var isInIframe = (window.self !== window.top) ? true : false;
	return isInIframe;
}
ENGAGEYA.prototype.is_start_of_row = function (currentSlideIdx, slidesPerRow)
{
	if ((currentSlideIdx%slidesPerRow) == 0)
	{
		return true;
	}
	return false;
}
ENGAGEYA.prototype.add_row_if_required = function (nextSlideIdx, slidesPerRow, slidesCount)
{
	if ((nextSlideIdx%slidesPerRow) == 0 && nextSlideIdx != slidesCount)
	{
		return '<div style="clear: both" class="eng_rows_seperator"></div>';
	}
	return '';
	
}
ENGAGEYA.prototype.floor_figure = function (figure, decimals)
{
    if (!decimals) decimals = 2;
    var d = Math.pow(10,decimals);
    return (parseInt(figure*d)/d).toFixed(decimals);
};
ENGAGEYA.prototype.calc_slides_dims = function ()
{
	try
	{
		var availableWidth = this.width-this.widget_lpadding-this.widget_rpadding-this.widget_rmargin-this.widget_lmargin-this.slides_wrapper_lpadding-this.slides_wrapper_rpadding-this.slides_wrapper_lmargin-this.slides_wrapper_rmargin;
		var numOfSlideWithoutMargin = Math.floor(availableWidth/this.slide_width);
		var calculatedNumOfSlidesPerRow = Math.floor((availableWidth-((numOfSlideWithoutMargin-1)*this.slide_horz_margin))/(this.slide_width));
		var jsvls = this.get_add_data("jsvls");
		if (this.is_mobile_conditions_satisfied())
		{
			this.num_of_slides_a_row = this.num_of_mobile_slides_a_row ? this.num_of_mobile_slides_a_row : calculatedNumOfSlidesPerRow;
		}
		else
		{
			this.num_of_slides_a_row = this.num_of_slides_a_row ? this.num_of_slides_a_row : calculatedNumOfSlidesPerRow;
		}	
		var jcss = this.get_add_data("jcss");
		if (this.num_of_slides_a_row == 0 && availableWidth > 99) // force adding at least 1 slide if possible
		{
			this.slide_width = availableWidth;
			this.num_of_slides_a_row = 1;
		}
		if (!this.is_video_widget && this.num_of_slides_a_row > 1 && (!jcss || !jcss.sw))
		{
			var widgetWidthDelta = availableWidth - (this.num_of_slides_a_row * this.slide_width)-(this.slide_horz_margin*(this.num_of_slides_a_row-1))
			var finalSlideWidth = (widgetWidthDelta/this.num_of_slides_a_row) + this.slide_width;
			this.slide_width = this.floor_figure(finalSlideWidth,2); 
		}
	}
	catch(e)
	{
		this.num_of_slides_a_row = 1;
		console.log('ERROR');console.log(e);
	}	
}
ENGAGEYA.prototype.populate_required_fields = function ()
{
	this.calculate_widget_wrapper_dims();
}
ENGAGEYA.prototype.calculate_widget_wrapper_dims = function()
{
	var elm = this.is_video_widget == 1 ? document.getElementById(this.plr_elm_id) : this.widget_wrapper_elm;
	elm  = elm ? elm : this.widget_wrapper_elm;
	var origElm = elm;
	this.width = this.width ? this.width : this.jq(elm).width();
	var exactWidth = this.get_exact_width(elm);
	if (exactWidth)
	{
		this.width = exactWidth;
	}
	this.height = this.height ? this.height : this.jq(elm).height();
	try
	{
		while (elm && (this.height === 0 || this.height < 100) && this.jq(elm).parent())
		{
			if (elm)
			{
				elm = this.jq(elm).parent().get(0);
				this.height = this.jq(elm).height();
			}	
		}
		elm = origElm;
		while (elm && (this.width === 0 || this.width < 100) && this.jq(elm).parent())
		{
			elm = this.jq(elm).parent().get(0);
			if (elm)
			{
				this.width = this.jq(elm).width();
				exactWidth = this.get_exact_width(elm);
				this.width = exactWidth ? exactWidth : this.width;
			}	
		}
	}	
	catch(e)
	{
		console.log('ERROR');console.log(e);
	}	
}

ENGAGEYA.prototype.get_exact_width = function (elm)
{
	var exactWidth = this.jq(elm)[0].getBoundingClientRect().width;
	if (exactWidth && Math.abs(exactWidth - this.width) > 0 && Math.abs(exactWidth - this.width) < 1)
	{
		return exactWidth;
	}
	return null;
}
ENGAGEYA.prototype.create_placement = function ()
{
	this.populate_required_fields();
	var slidesDiv = document.createElement('div');
	slidesDiv.id = "eng_recs_holder_"+this.random_id;
	slidesDiv.className = "eng_recs_holder";
	this.widget_wrapper_elm.appendChild(slidesDiv);
	var css = document.createElement('style');
	css.type = 'text/css';
	var display = this.is_video_widget ? 'none' : 'block';
	var videoCss = '#eng_recs_holder_'+this.random_id+' .eng_widget_sw:hover{zoom:1;filter:alpha(opacity=100);opacity:1;-webkit-filter: brightness(120%);filter: brightness(1.2);}'+
				   '#eng_recs_holder_'+this.random_id+' .eng_widget_sw{filter:alpha(opacity=90);opacity:0.9;}'+	
				   '#eng_recs_holder_'+this.random_id+'{height:'+(this.height-40)+'px;-webkit-transform-style: preserve-3d;-moz-transform-style: preserve-3d;transform-style: preserve-3d;}#eng_top_ww_widget_'+this.random_id+'{position: relative;top: 50%;transform: translateY(-50%);width: 100%;}';
	var styles = "";
	if (this.is_video_widget)
	{
		this.jq(this.widget_wrapper_elm).parent().css('position','relative');
		styles += videoCss;
		styles += '.eng_recs_holder{width: 100%;top:0px;position: absolute;text-align:center;z-index:999999;background-color: rgba(1, 1, 1, 0.6);}#eng_recs_holder_'+this.random_id+'{display:'+display+';}.eng_recs_holder a{text-decoration:none;}';
	}
	if (css.styleSheet) css.styleSheet.cssText = styles;
	else css.appendChild(document.createTextNode(styles));
	document.getElementsByTagName('head')[0].appendChild(css);
}
ENGAGEYA.prototype.get_page_ttl = function ()
{
	var ttl = "";
	var ttls = document.getElementsByTagName("title");
	if (ttls && ttls.length > 0)
	{
		try {
			ttl = ttls[0].innerText || ttls[0].textContent;
			ttl = ttl.substring(0,100).substring(0,ttl.lastIndexOf(" "));
			ttl = encodeURIComponent(ttl);
		} catch(e){}	
	}
	return ttl;
}
ENGAGEYA.prototype.get_meta_content = function (prop,attr)
{
	var metaTags = document.getElementsByTagName("meta");
	var content = "";
	for (var i = 0; i < metaTags.length; i++) {
		if (metaTags[i].getAttribute("property") == prop || metaTags[i].getAttribute("name") == prop) {
			try {
				content = metaTags[i].getAttribute(attr);
				content = content.substring(0,200).substring(0,content.lastIndexOf(" "));
				content = encodeURIComponent(content);
			} catch(e){}
			break;
		}
	}
	return content;
}
ENGAGEYA.prototype.get_lang = function ()
{
	var browserLang = window.navigator.userLanguage || window.navigator.language;
	return browserLang;
}
ENGAGEYA.prototype.append_script_to_head = function (scriptURL,id)
{
	var s = document.createElement("script");
	s.type = "text/javascript";
	s.id = id;
	s.src = scriptURL;
	s.charset = "UTF-8";
	s.async = true;
	var h=document.getElementsByTagName("script")[0];
	h.parentNode.insertBefore(s,h);
}
ENGAGEYA.prototype.getQS = function (str)
{
	var queryString = str.replace(/^[^\?]+\??/,'');
	var Params = new Object ();
	if (!queryString) return Params; 
	var Pairs = queryString.split(/[;&]/);
	for ( var i = 0; i < Pairs.length; i++ )
	{
		var cleanPairs = Pairs[i].replace(/(pid=.*)=.*/, "$1");
		var numOfEqls = Pairs[i].length - cleanPairs.length;
		for (var j=0;j<numOfEqls;j++)
		{
			cleanPairs = cleanPairs + '%3D';
		}
		var KeyVal = cleanPairs.split(/=(.*)/);
		if ( ! KeyVal || KeyVal.length < 2 ) continue;
		var key = unescape( KeyVal[0] );
		var val = KeyVal[1];
		val = val.replace(/\+/g, ' ');
		Params[key] = val;
	}
	return Params;
}
ENGAGEYA.prototype.inj_init_binding = function (obj) 
{
	if ( document.addEventListener ) 
	{ 
	   document.addEventListener( "DOMContentLoaded", obj.doc_ready(obj), false )
	} 
	else if ( document.attachEvent ) 
	{ 
		try {
			var isFrame = window.frameElement != null
		} catch(e) {}
		if ( document.documentElement.doScroll && !isFrame ) {
			function tryScroll(){
				if (called) return
				try {
					document.documentElement.doScroll("left")
					obj.doc_ready(obj)
				} catch(e) {
					setTimeout(tryScroll, 10)
				}
			}
			tryScroll()
		}
		document.attachEvent("onreadystatechange", function(){
			if ( document.readyState === "complete" ) {
				obj.doc_ready(obj)
			}
		})
	}
}
ENGAGEYA.prototype.in_array = function (val, arr) 
{
	for(var i in arr) 
	{
		if(arr[i] == val) return true;
	}
	return false;
}
var _eng_do_async_click = function (clickUrl)
{
	var clkScript = document.createElement("script");
	clkScript.type = "text/javascript"
	//clkScript.setAttribute("data-cfasync","false");
	clkScript.src = clickUrl;
	document.getElementsByTagName('head')[0].appendChild(clkScript);
};
(function ()
{
	var executor = function (cmd,params) 
	{
		switch(cmd) 
		{
			case "createWidget":
				var engageya = new ENGAGEYA(params);
				engageya.run();
				break;
		}
	};
	var func = window['EngageyaObject'];
	var time = window[func].l;
	for (var key in window[func].q) 
	{ 
		var obj = window[func].q[key];
		var cmd  = obj[0];
		var params = obj[1];
		executor(cmd,params);	
	}
	window[func] = executor;
}());

