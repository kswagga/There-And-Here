// This contains the module definition factory function, application state,
// events, and the router.
this.thereandhere = {
	// break up logical components of code into modules.
	module: function()
	{
		// Internal module cache.
		var modules = {};

		// Create a new module reference scaffold or load an existing module.
		return function(name) 
		{
			// If this module has already been created, return it.
			if (modules[name]) return modules[name];

			// Create a module and save it under this name
			return modules[name] = { Views: {} };
		};
	}(),

  // Keep active application instances namespaced under an app object.
  app: _.extend({
	
	


	//this function is called once all the js files are sucessfully loaded
	init : function()
	{
		this.loadModules();
		this.isLoaded = true
		this.startRouter();
	},
	
	loadModules : function()
	{
		var _this=this;
		var Connections = thereandhere.module("connections");
		
		
		this.connectionsCollection = new Connections.Collection();

		_.each(lines.features,function(connection){
			console.log(connection);
			_this.connectionsCollection.add(new Connections.Model(connection.properties));
		});

		this.connectionsMap=new Connections.Views.Map({collection:this.connectionsCollection});
		console.log(this.connectionsCollection);
	
	},
	
	startRouter: function()
	{
		var _this = this;
		var Router = Backbone.Router.extend({
			routes: {
				""							: 'loadMain',
				"connection/:connectionId"	: "goToConnection",

			},
			goToConnection : function( connectionId ){ _this.goToConnection( connectionId ) },
			loadMain : function(  ){ _this.loadMain() }
		});

		this.router = new Router();
		Backbone.history.start();
	},
	
	goToConnection : function(connectionId)
	{
		console.log('GO TO Connection: '+connectionId);
		this.loadPlayer(connectionId);
	},

	loadMain : function( frame )
	{

		console.log('Loading Main');
		$('#main').html(this.connectionsMap.render());
		this.connectionsMap.addMap();
		var _this=this;
		
		
		
		//UX
		
		
		$('#home').click(function(){ thereandhere.app.home();});
	
		
		
		
	},
	
	home: function(){
		console.log('goin home');
		this.router.navigate('',{silent:true});
		
		zeega.app.exitProject();
		$('#tah-player').fadeOut('fast');
	
	},
	

	
	loadPlayer: function(connectionId){
	

		var connection=this.connectionsCollection.get(connectionId);
		var _this=this;
		var Connections = thereandhere.module("connections");
		this.router.navigate('connection/'+ connectionId, {silent:true});
		
		
		
		
		this.navMaps=[
			new Connections.Views.NavMap({
				collection:connection.itemCollections[0]
			}),
			new Connections.Views.NavMap({
				collection:connection.itemCollections[1]
			})
		];
			
		
		$('#tah-map-top').append(this.navMaps[0].render());
		$('#tah-map-bottom').append(this.navMaps[1].render());
		
		$('#tah-player').fadeIn('fast',function(){
			_this.navMaps[0].addMap();
			_this.navMaps[1].addMap();
		});
		
		zeega.app.loadProject(257);
		_.each( _.toArray(this.navMaps[0].collection), function(itemModel){		
			itemModel.on('selected',function(){
				console.log(itemModel.get('attributes').project_id);
				$('#project_title').fadeOut('fast',function(){
					$(this).html(itemModel.get('title')).fadeIn();
					});
				zeega.app.loadProject(itemModel.get('attributes').project_id,{'frameID':itemModel.get('attributes').frame_id});
		});
		
		});
		_.each( _.toArray(this.navMaps[1].collection), function(itemModel){		
			itemModel.on('selected',function(){
				console.log(itemModel.get('attributes').project_id);
				$('#project_title').fadeOut('fast',function(){
					$(this).html(itemModel.get('title')).fadeIn();
					});
				zeega.app.loadProject(itemModel.get('attributes').project_id,{'frameID':itemModel.get('attributes').frame_id});
		});
		
		});
	},
	
	
	
}, Backbone.Events)


};
