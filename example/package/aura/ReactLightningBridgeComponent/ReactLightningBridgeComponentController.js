({
	doInit: function(cmp, event, helper) {
		window.ReactLightningBridge.init(cmp);
	},
	handleEvent: function(cmp, event) {
		window.ReactLightningBridge.handleEvent(cmp, event);
	}
})
