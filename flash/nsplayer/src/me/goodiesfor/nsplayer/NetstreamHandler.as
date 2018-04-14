package me.goodiesfor.nsplayer 
{
	/**
	 * ...
	 * @author liquid8d
	 */
	import flash.events.AsyncErrorEvent;
	import flash.events.DRMErrorEvent;
	import flash.events.NetStatusEvent;
	import flash.events.TimerEvent;
	import flash.net.NetConnection;
	import flash.net.NetStream;
	import flash.events.IOErrorEvent;
	import flash.net.NetStreamPlayOptions;
	import flash.net.NetStreamPlayTransitions;
	import org.openvideoplayer.events.OvpEvent;
	import flash.utils.Timer;
	
	public class NetstreamHandler
	{
		protected var nc:NetConnection;
		public var netstream:NetStream;
		public var data:VideoData;
		private var dataTimer:Timer;
		
		public function NetstreamHandler() 
		{
			data = new VideoData();
			
			dataTimer = new Timer(250, 0);
			dataTimer.addEventListener(TimerEvent.TIMER, onUpdate);
			
			// setup netconnection
			nc = new NetConnection();
			nc.connect(null);
			var listener:Object = new Object();
			listener.onEdge = onEdge;
			listener.onMetadata = onMetadata;
			// listener.onPlayStatus = onPlayStatus;
			// listener.onCuePoint = onCuePoint;
			
			// setup netstream
			netstream = new NetStream(nc);
			netstream.client = listener;
			netstream.addEventListener(NetStatusEvent.NET_STATUS, onNetStatus);
			netstream.addEventListener(OvpEvent.IS_BUFFERING, onBuffer);
			netstream.addEventListener(AsyncErrorEvent.ASYNC_ERROR, onAsyncError);
			netstream.addEventListener(IOErrorEvent.IO_ERROR, onIOError);
			netstream.addEventListener(DRMErrorEvent.DRM_ERROR, onDRMError);
		}
		
		private function onUpdate(event:TimerEvent):void {
			try {
				if (netstream != null && data.isPlaying) {
					data.time = netstream.time;
					data.currentTime = roundToNearest(data.streamStartTime + data.time, 1);
				}
			} catch (e:Error) {}
		}
		
		public function play(url:String, seek:Number = 0):void {
			data.firstEdge = true
			if (seek != 0) url = url + "?seek=" + Math.floor(seek);
			
			var opts:NetStreamPlayOptions = new NetStreamPlayOptions();
			opts.streamName = url;
			opts.transition = NetStreamPlayTransitions.SWITCH;
			opts.offset = -1;
			netstream.play2(opts);
		}
		
		public function pause():void {
			netstream.pause();
		}
		
		public function stop():void {
			if (netstream) netstream.close();
		}
		
		private function onMetadata(info:Object):void {
			
		}
		
		private function onEdge(info:Object):void {
			data.streamName = info['streamName'];
			data.isLive = info['isLive'];
			if (data.firstEdge) onFirstEdge(info);
		}
		
		private function onFirstEdge(info:Object):void {
			data.isLive = info['isLive'];
			data.transferToken = info['transferToken'];
			data.currentSession = info['currentSession'];
			data.streamStartTime = info['streamStartTime'];
			data.initialTime = data.streamStartTime;
			data.streamLength = info['streamLength'];
			data.streamStartSeek = info['timeBase'];
			if (data.isLive) data.currentSeek = info['timeBase'];
			data.firstEdge = false;
		}
		
		private function onNetStatus(event:NetStatusEvent):void
		{
			switch (event.info.code) {
				case "NetStream.Ready":
					break;
				case "NetStream.Play.Start":
					data.isPlaying = true;
					data.isPaused = false;
					data.paused = false;
					break;
				case "NetStream.Play.Stop":
					data.isPlaying = false;
					data.isPaused = false;
					data.paused = false;
					break;
				case "NetStream.Play.StreamNotFound":
					data.isPlaying = false;
					data.isPaused = false;
					trace("stream not found");
					break;
				case "NetStream.Pause.Notify":
					data.isPlaying = false;
					data.isPaused = true;
					data.paused = true;
					break;
				case "NetStream.Unpause.Notify":
					data.isPlaying = true;
					data.isPaused = false;
					data.paused = false;
					break;
				case "NetStream.Seek.Start":
					data.isSeeking = true;
					break;
				case "NetStream.Seek.Notify":
					data.isSeeking = false;
					break;
				case "NetStream.Buffer.Empty":
					break;
				case "NetStream.Buffer.Flush":
					break;
				case "NetStream.Buffer.Full":
					break;
				default:
					break;
			}
		}
		
		private function onBuffer( event:OvpEvent ):void
		{
			data.isBuffering = event.data
		}
		
		private function onIOError(err:IOErrorEvent):void
		{
			trace ("Netstream: onIOError: " + err.text);
		}
		
		private function onAsyncError(err:AsyncErrorEvent):void {
			trace ("Netstream: onAsyncError: " + err.error);
		}
		
		private function onDRMError(err:DRMErrorEvent):void
		{
			trace("DRM error: " + err.text);
		}
		
		/*
		 * Helper Functions
		 */
		public static function roundToNearest(value:Number, roundTo:Number = 10):Number{
			return Math.floor(value/roundTo)*roundTo;
		}
	}

}