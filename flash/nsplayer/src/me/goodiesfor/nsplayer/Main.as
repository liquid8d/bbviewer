package me.goodiesfor.nsplayer
{
	import flash.events.Event;
	import flash.external.ExternalInterface;
	import flash.display.StageScaleMode;
	import flash.display.StageAlign;
	import flash.display.Sprite;
	import flash.media.Video;
	import flash.system.Security;
	import me.goodiesfor.nsplayer.VJSRouter;
	import flash.display.LoaderInfo;
	
	/**
	 * This swf is designed to use netstream within videojs
	 * @author liquid8d
	 */
	
	[SWF(backgroundColor = "0x000000")]
	public class Main extends Sprite 
	{
		public static const ENABLE_SMOOTHING:Boolean = true;
		public static const ASPECT:Number = 16 / 9;
		
		private var router:VJSRouter = new VJSRouter();
		private var video:Video;
		
		public function Main() 
		{
			if (stage) init();
			else addEventListener(Event.ADDED_TO_STAGE, init);
		}
		
		private function init(e:Event = null):void 
		{
			// entry point
			
			removeEventListener(Event.ADDED_TO_STAGE, init);
			
			// setup stage
			this.stage.scaleMode = StageScaleMode.NO_SCALE;
			this.stage.align = StageAlign.TOP_LEFT;
			this.stage.addEventListener(Event.RESIZE, resizeDisplay);
			
			// Allow JS calls from other domains
            Security.allowDomain("*");
            Security.allowInsecureDomain("*");
			
			// setup external callbacks for javascript
			if ( ExternalInterface.available ) {
				trace("registering callbacks");
				registerExternalMethods();
			} else {
				trace("no externalinterface");
			}
			
			// attach video
			video = new Video(this.stage.stageWidth, this.stage.stageHeight);
			addChild(video);
			resizeDisplay(null);
			
			// setup netstream
			video.attachNetStream(router.handler.netstream);
			video.smoothing = ENABLE_SMOOTHING;
			
		}
		
		private function resizeDisplay(event:Event):void {
			// resize content
			var height:Number = this.stage.stageWidth / ASPECT;
			if (height > this.stage.stageHeight) height = this.stage.stageHeight;
			var width:Number = height * ASPECT;
			
			// center content
			video.width = width;
			video.height = height;
			video.x = (this.stage.stageWidth / 2) - (width / 2);
			video.y = (this.stage.stageHeight / 2) - (height / 2);
		}
		
		private function registerExternalMethods():void {
			//register any functions to be available in javascript
			ExternalInterface.marshallExceptions = true;
			try {
				// vjs callbacks
				// ExternalInterface.addCallback("vjs_appendBuffer", router.onAppendBufferCalled)
				// ExternalInterface.addCallback("vjs_appendChunkReady", router.onAppendChunkReadyCalled)
				// ExternalInterface.addCallback("vjs_echo", router.onEchoCalled)
				ExternalInterface.addCallback("vjs_endOfStream", router.onEndOfStreamCalled)
				ExternalInterface.addCallback("vjs_abort", router.onAbortCalled)
				// ExternalInterface.addCallback("vjs_discontinuity", router.onDiscontinuityCalled)
				ExternalInterface.addCallback("vjs_getProperty", router.onGetPropertyCalled);
				ExternalInterface.addCallback("vjs_setProperty", router.onSetPropertyCalled);
				ExternalInterface.addCallback("vjs_autoplay", router.onAutoplayCalled);
				ExternalInterface.addCallback("vjs_src", router.onSrcCalled);
				ExternalInterface.addCallback("vjs_load", router.onLoadCalled);
				ExternalInterface.addCallback("vjs_play", router.onPlayCalled);
				ExternalInterface.addCallback("vjs_pause", router.onPauseCalled);
				ExternalInterface.addCallback("vjs_resume", router.onResumeCalled);
				ExternalInterface.addCallback("vjs_stop", router.onStopCalled);
				ExternalInterface.addCallback("vjs_adjustCurrentTime", router.onAdjustCurrentTimeCalled);
				
				// player callbacks
				//ExternalInterface.addCallback("sendControl", sendControl);
			} catch ( e:SecurityError) {
				trace("security error" + e.errorID + " " + e.message);
				trace("sandbox type: " + Security.sandboxType);
			} catch ( e:Error ) {
				trace("error: " + e.message);
			} finally {
				
			}
			
			VJSRouter.sendToJavascript({ action: 'params', data: loaderInfo.parameters });
			ExternalInterface.call('videojs.Flash.onReady', ExternalInterface.objectID);
		}
	}	
}