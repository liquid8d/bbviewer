package me.goodiesfor.nsplayer 
{
	/**
	 * ...
	 * @author liquid8d
	 */
	public class VideoData 
	{
		// vjs params
		public var mode:String = "video";
		public var autoplay:Boolean = true;
		public var loop:Boolean = false;
		public var preload:String = "auto";
		public var metadata:Object;
		public var duration:Number;
		public var currentTime:Number;
		public var time:Number;
		public var initialTime:Number;
		public var defaultPlaybackRate:Number = 1.0;
		public var ended:Boolean;
		public var muted:Boolean = false;
		public var paused:Boolean = false;
		public var seeking:Boolean = false;
		public var volume:Number = 1.0;
		public var networkState:int = 1;
		public var readyState:int = 1;
		public var buffered:Array = [];
		public var bufferedBytesEnd:int = 0;
		public var bytesTotal:int = 0;
		public var videoWidth:int = 0;
		public var videoHeight:int = 0;
		public var eventProxyFunction:String;
		public var errorEventProxyFunction:String;
		
		public var host:String;
		public var path:String;
		public var url:String;
		
		// netstream data
		public var firstEdge:Boolean;
		public var streamName:String;
		public var isLive:Boolean;
		public var transferToken:String;
		public var currentSession:String;
		public var streamStartTime:Number;
		public var streamLength:Number;
		public var streamStartSeek:Number;
		
		// player data
		public var currentSeek:Number;
		public var isPlaying:Boolean;
		public var isPaused:Boolean;
		public var isBuffering:Boolean;
		public var isSeeking:Boolean;
	}

}