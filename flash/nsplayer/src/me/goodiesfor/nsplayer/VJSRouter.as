package me.goodiesfor.nsplayer 
{
	/**
	 * ...
	 * @author liquid8d
	 */
	import flash.external.ExternalInterface;
	
	public class VJSRouter 
	{
		public var handler:NetstreamHandler = new NetstreamHandler();
		
		public function onAppendBufferCalled(base64str:String):void 
		{
			sendToJavascript({ action: "appendBuffer", data: base64str })
		}
		
		public function onAppendChunkReadyCalled(fnName:String):void 
		{
			sendToJavascript({ action: "appendChunk", data: fnName })
		}
		
		public function onAdjustCurrentTimeCalled(pValue:Number):void 
		{
			sendToJavascript({ action: "adjustcurrentTimeCalled", data: pValue })
		}

		public function onEchoCalled(pResponse:* = null):* 
		{
			sendToJavascript({ action: "echoCalled", data: pResponse })
		}
		
		public function onEndOfStreamCalled():* 
		{
			sendToJavascript({ action: "endOfStreamCalled", data: null })
		}
		
		public function onAbortCalled():* 
		{
			sendToJavascript({ action: "abortCalled", data: null })
		}
		
		public function onDiscontinuityCalled(data:*):void 
		{
			sendToJavascript({ action: "discontinuityCalled", data: null })
		}
		
		public function onGetPropertyCalled(pPropertyName:String):* 
		{
			//sendToJavascript({ action: "getPropertyCalled", data: pPropertyName })
			switch(pPropertyName) {
				case "mode":
					return handler.data.mode;
				case "autoplay":
					return handler.data.autoplay;
				case "loop":
					return handler.data.loop;
				case "preload":
					return handler.data.preload;
				case "metadata":
					return handler.data.metadata;
				case "duration":
					return handler.data.duration;
				case "eventProxyFunction":
					return handler.data.eventProxyFunction;
				case "errorEventProxyFunction":
					return handler.data.errorEventProxyFunction;
				case "currentSrc":
					return handler.data.url;
				case "currentTime":
					return handler.data.currentTime;
				case "time":
					return handler.data.time;
				case "initialTime":
					return handler.data.initialTime;
				case "defaultPlaybackRate":
					return handler.data.defaultPlaybackRate;
				case "ended":
					return handler.data.ended;
				case "volume":
					return handler.data.volume;
				case "muted":
					return handler.data.muted;
				case "paused":
					return handler.data.paused;
				case "seeking":
					return handler.data.seeking;
				case "networkState":
					return handler.data.networkState;
				case "readyState":
					return handler.data.readyState;
				case "buffered":
					return handler.data.buffered;
				case "bufferedBytesEnd":
					return handler.data.bufferedBytesEnd;
				case "bytesTotal":
					return handler.data.bytesTotal;
				case "videoWidth":
					return handler.data.videoWidth;
				case "videoHeight":
					return handler.data.videoHeight;
				case "rtmpConnection":
					return handler.data.host;
				case "rtmpStream":
					return handler.data.path;
				case "getVideoPlaybackQuality":
					return 0;
				default:
					return;
			}
		}
		
		public function onSetPropertyCalled(pPropertyName:String, pValue:* = null):void 
		{
			sendToJavascript({ action: "setPropertyCalled", data: pPropertyName + ":" + pValue })
			switch(pPropertyName) {
				case "rtmpConnection":
					handler.data.host = pValue;
					break;
				case "rtmpStream":
					handler.data.path = pValue;
					handler.data.url = handler.data.host + handler.data.path;
					onPlayCalled();
					break;
				default:
					break;
			}
		}
		
		public function onAutoplayCalled(pAutoplay:* = false):void 
		{
			sendToJavascript({ action: "autoplayCalled", data: pAutoplay })
		}
		
		public function onSrcCalled(pSrc:* = ""):void 
		{
			sendToJavascript({ action: "srcCalled", data: handler.data.url })
		}
		
		public function onLoadCalled():void 
		{
			sendToJavascript({ action: "loadCalled", data: null })
		}
		
		public function onPlayCalled():void 
		{
			handler.play(handler.data.url);
			sendToJavascript({ action: "playCalled", data: handler.data.url })
		}
		
		public function onPauseCalled():void 
		{
			handler.pause();
			sendToJavascript({ action: "pauseCalled", data: handler.data.url })
		}
		
		public function onResumeCalled():void 
		{
			sendToJavascript({ action: "resumeCalled", data: handler.data.url })
		}
		
		public function onStopCalled():void 
		{
			handler.stop();
			sendToJavascript({ action: "stopCalled", data: handler.data.url })
		}
		
		public static function sendToJavascript(args:Object = null):void {
			if ( ExternalInterface.available )
				ExternalInterface.call("swfPlayer", args, ExternalInterface.objectID);
		}

	}

}