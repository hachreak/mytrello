/**
 * Copyright (C) 2014 Leonardo Rossi <leonardo.rossi@studenti.unipr.it>
 *
 * This source code is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This source code is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this source code; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
 *
 */

var MyTrelloApp = angular.module("MyTrelloApp", [ 'ngRoute' ]);

MyTrelloApp.config([
		'$routeProvider',
		'$locationProvider',
		'$rootScopeProvider',
		function($routeProvider, $locationProvider, $rootScopeProvider) {
			$routeProvider

			.when('/Gui/Users/Login', {
				templateUrl : 'templates/user-login.html',
				controller : 'UsersLoginCtrl'
			}).when('/Gui/Users/Logout', {
				templateUrl : 'templates/user-logout.html',
				controller : 'UsersLogoutCtrl'
			})

			.when('/Gui/Users/:uid/Boards/Create', {
				templateUrl : 'templates/board-create.html',
				controller : 'BoardCreateCtrl'
			}).when('/Gui/Users/:uid/Boards/:bid', {
				templateUrl : 'templates/board-read.html',
				controller : 'BoardReadCtrl',
			}).when('/Gui/Users/:uid/Boards', {
				templateUrl : 'templates/boards-read.html',
				controller : 'BoardsReadCtrl'
			}).when('/Gui/Boarda/:bid/Update', {
				templateUrl : 'templates/board-create.html',
				controller : 'BoardUpdateCtrl'
			}).when('/Gui/Users/:uid/Boards/:bid/Delete', {
				templateUrl : 'templates/board-delete.html',
				controller : 'BoardDeleteCtrl'
			}).when('/Gui/Users/:uid/Boards/Create', {
				templateUrl : 'templates/board-create.html',
				controller : 'BoardCreateCtrl'
			})

			.when('/Gui/Users/:uid/Boards/:bid/lists/Create', {
				templateUrl : 'templates/list-create.html',
				controller : 'ListCreateCtrl'
			}).when('/Gui/Users/:uid/Boards/:bid/lists/:lid', {
				templateUrl : 'templates/list-read.html',
				controller : 'ListReadCtrl',
			}).when('/Gui/Users/:uid/Boards/:bid/lists/:lid/Update', {
				templateUrl : 'templates/list-create.html',
				controller : 'ListUpdateCtrl'
			}).when('/Gui/Users/:uid/Boards/:bid/lists/:lid/Delete', {
				templateUrl : 'templates/list-delete.html',
				controller : 'ListDeleteCtrl'
			})

			.when('/Gui/Users/:uid/Boards/:bid/lists/:lid/cards/Create', {
				templateUrl : 'templates/card-create.html',
				controller : 'CardCreateCtrl'
			}).when('/Gui/Users/:uid/Boards/:bid/lists/:lid/cards/:cid', {
				templateUrl : 'templates/card-read.html',
				controller : 'CardReadCtrl',
			}).when('/Gui/Users/:uid/Boards/:bid/lists/:lid/cards/:cid/Update',
					{
						templateUrl : 'templates/card-create.html',
						controller : 'CardUpdateCtrl'
					}).when(
					'/Gui/Users/:uid/Boards/:bid/lists/:lid/cards/:cid/Delete',
					{
						templateUrl : 'templates/card-delete.html',
						controller : 'CardDeleteCtrl'
					})

			.otherwise({
				redirectTo : '/Gui/Users/Login'
			});
		} ]);

MyTrelloApp.controller('UsersLoginCtrl', [
		'$scope',
		'$location',
		'$rootScope',
		'UserService',
		'BoardService',
		function($scope, $location, $rootScope, UserService, BoardService) {
			$rootScope.user = UserService.login($scope.newuser);
			if (typeof $rootScope.user.id !== "undefined") {
				BoardService.init($rootScope.user);
				$location.path('/Gui/Users/' + $rootScope.user.id + '/Boards');
			}

			$scope.login = function() {

				// console.log($scope.user.username);
				$rootScope.user = UserService.login($scope.newuser);
				if (typeof $rootScope.user.id !== "undefined") {
					BoardService.init($rootScope.user);
					$location.path('/Gui/Users/' + $rootScope.user.id
							+ '/Boards');
				} else {
					$scope.message = 'Login error';
				}
			};

		} ]);

MyTrelloApp.controller('UsersLogoutCtrl', [
		'$scope',
		'$location',
		'$rootScope',
		'UserService',
		'BoardService',
		function($scope, $location, $rootScope, UserService, BoardService) {
			$rootScope.user = UserService.login($scope.newuser);
			if (typeof $rootScope.user.id !== "undefined") {
				BoardService.clear();
				UserService.logout();
				$location.path('#');
			}

			$scope.login = function() {

				// console.log($scope.user.username);
				$rootScope.user = UserService.login($scope.newuser);
				if (typeof $rootScope.user.id !== "undefined") {
					BoardService.init($rootScope.user);
					$location.path('/Gui/Users/' + $rootScope.user.id
							+ '/Boards');
				} else {
					console.log("errore login...");
				}
			};

		} ]);

MyTrelloApp.controller('BoardsCtrl', [
		'$scope',
		'$http',
		'$location',
		'$rootScope',
		'BoardService',
		'UserService',
		function($scope, $http, $location, $rootScope, BoardService,
				UserService) {
			// check if is logged in
			$rootScope.$on('$routeChangeStart', function(event, next) {
				if (next.originalPath != "/Gui/Users/Login") {
					$rootScope.user = UserService.login();

					if (typeof $rootScope.user.id === "undefined") {
						$location.path("#");
					}
				}
			});

			$scope.$on('boards:updated', function(event, data) {
				$scope.boards = data;
			});

			/*
			 * $scope.removeBoard = function(id) {
			 * 
			 * BoardService.remove(id); if ($scope.newboard.id == id)
			 * $scope.newboard = {}; };
			 */
		} ]);

MyTrelloApp.controller('BoardCreateCtrl', [ '$scope', '$http', '$rootScope',
		'BoardService', '$location',
		function($scope, $http, $rootScope, BoardService, $location) {
			// $scope.boards = BoardService.list();

			$scope.saveBoard = function() {
				BoardService.save($scope.newboard);
				$scope.newboard = {};
				$location.path('/Gui/Users/:uid/Boards');
			};
		} ]);

MyTrelloApp.controller('BoardReadCtrl', [ '$scope', '$routeParams', '$route',
		'$rootScope', 'BoardService',
		function($scope, $routeParams, $route, $rootScope, BoardService) {
			$scope.bid = $routeParams.bid;
			$scope.board = BoardService.get($scope.bid);
		} ]);

MyTrelloApp.controller('BoardsReadCtrl', [ '$scope', '$rootScope',
		'UserService', function($scope, $rootScope, UserService) {
		} ]);

MyTrelloApp.controller('BoardUpdateCtrl', [ '$scope', '$routeParams', '$route',
		'$rootScope', 'BoardService',
		function($scope, $routeParams, $route, $rootScope, BoardService) {
			$scope.bid = $routeParams.bid;
			$scope.newboard = BoardService.get($routeParams.bid);
			$scope.message = "UpdateBoardCtrl";
		} ]);

MyTrelloApp.controller('BoardDeleteCtrl', [ '$scope', '$http', '$routeParams',
		'BoardService', '$location',
		function($scope, $http, $routeParams, BoardService, $location) {
			// $scope.boards = BoardService.list();
			$scope.bid = $routeParams.bid;

			$scope.removeBoard = function(bid) {
				BoardService.remove(bid);
				$location.path('/Gui/Users/:uid/Boards');
			};

			$scope.back = function() {
				$location.path('/Gui/Users/:uid/Boards');
			};

		} ]);

MyTrelloApp.controller('ListCreateCtrl', [
		'$scope',
		'$http',
		'$routeParams',
		'$routeParams',
		'BoardService',
		'$location',
		function($scope, $http, $routeParams, $routeParams, BoardService,
				$location) {
			$scope.newlist = {
				board : $routeParams.bid
			// BoardService.get($routeParams.bid);
			};
			/*
			 * $scope.board = { id: $routeParams.bid };
			 */

			$scope.saveList = function() {
				var bid = $scope.newlist.board;
				BoardService.saveList($scope.newlist);
				$scope.newlist = {};
				$location.path('/Gui/Users/:uid/Boards/' + bid);
			};
		} ]);

MyTrelloApp.controller('ListUpdateCtrl', [
		'$scope',
		'$routeParams',
		'$route',
		'$routeParams',
		'BoardService',
		'$location',
		function($scope, $routeParams, $route, $routeParams, BoardService,
				$location) {
			$scope.newlist = BoardService.getList($routeParams.bid,
					$routeParams.lid);

			$scope.saveList = function() {
				var bid = $scope.newlist.board;
				BoardService.saveList($scope.newlist);
				$scope.newlist = {};
				$location.path('/Gui/Users/:uid/Boards/' + bid);
			};
		} ]);

MyTrelloApp.controller('ListDeleteCtrl', [ '$scope', '$routeParams', '$http',
		'BoardService', '$location',
		function($scope, $routeParams, $http, BoardService, $location) {
			$scope.bid = $routeParams.bid;
			$scope.lid = $routeParams.lid;

			$scope.removeList = function(bid, lid) {
				// console.log(bid + ' ' + lid);
				BoardService.removeList(bid, lid);
				$location.path('/Gui/Users/:uid/Boards/' + bid);
			};

			$scope.back = function(bid) {
				$location.path('/Gui/Users/:uid/Boards/' + bid);
			};

		} ]);

MyTrelloApp.controller('CardCreateCtrl', [
		'$scope',
		'$http',
		'$routeParams',
		'$rootScope',
		'BoardService',
		'$location',
		function($scope, $http, $routeParams, $rootScope, BoardService,
				$location) {
			$scope.bid = $routeParams.bid;
			$scope.newcard = {
				list : $routeParams.lid
			};
			$scope.lists = BoardService.getLists($scope.bid);
			$scope.status = BoardService.getStatus();

			$scope.saveCard = function() {
				var bid = $scope.bid;
				BoardService.saveCard(bid, $scope.newcard);
				$scope.newcard = {};
				$location.path('/Gui/Users/:uid/Boards/' + bid);
			};
		} ]);

MyTrelloApp.controller('CardUpdateCtrl', [
		'$scope',
		'$routeParams',
		'$route',
		'$rootScope',
		'BoardService',
		'$location',
		function($scope, $routeParams, $route, $rootScope, BoardService,
				$location) {
			$scope.newcard = BoardService.getCard($routeParams.bid,
					$routeParams.lid, $routeParams.cid);
			$scope.bid = $routeParams.bid;
			$scope.lists = BoardService.getLists($routeParams.bid);
			$scope.status = BoardService.getStatus();

			$scope.saveCard = function() {
				var bid = $scope.bid;
				BoardService.saveCard(bid, $scope.newcard);
				$scope.newcard = {};
				$location.path('/Gui/Users/:uid/Boards/' + bid);
			};
		} ]);

MyTrelloApp.controller('CardDeleteCtrl', [ '$scope', '$routeParams', '$http',
		'BoardService', '$location',
		function($scope, $routeParams, $http, BoardService, $location) {
			$scope.bid = $routeParams.bid;
			$scope.lid = $routeParams.lid;
			$scope.cid = $routeParams.cid;

			$scope.removeCard = function(bid, lid, cid) {
				BoardService.removeCard(bid, lid, cid);
				$location.path('/Gui/Users/:uid/Boards/' + bid);
			};

			$scope.back = function(bid) {
				$location.path('/Gui/Users/:uid/Boards/' + bid);
			};

		} ]);

MyTrelloApp.service('UserService', function() {
	var uid = 3;

	var userLoggedin = {};

	var users = [ {
		id : 1,
		username : 'pippo',
		password : '123',
	}, {
		id : 2,
		username : 'pluto',
		password : '456'
	} ];

	// save method create a new board if not already exists
	// else update the existing object
	this.save = function(user) {
		if (user.id == null) {
			// if this is new board, add it in boards array
			user.id = uid++;
			users.push(user);
		} else {
			// for existing board, find this board using id
			// and update it.
			for (i in users) {
				if (users[i].id == user.id) {
					users[i] = user;
				}
			}
		}

	};

	// simply search users list for given id
	// and returns the board object if found
	this.get = function(id) {
		for (i in users) {
			if (users[i].id == id) {
				return users[i];
			}
		}
	};

	// iterate through users list and delete
	// board if found
	this.remove = function(id) {
		for (i in users) {
			if (users[i].id == id) {
				users.splice(i, 1);
			}
		}
	};

	// simply returns the boards list
	this.list = function() {
		return users;
	};

	this.login = function(user) {
		if (typeof userLoggedin.username !== "undefined")
			return userLoggedin;
		if (!user || !user.username || !user.password)
			return userLoggedin = {};
		for (i in users) {
			if (users[i].username == user.username
					&& users[i].password == user.password) {
				return userLoggedin = users[i];
			}
		}
		return userLoggedin = {};
	};
	
	this.logout = function(){
		userLoggedin = {};
	}
});

MyTrelloApp.service('BoardService', [ '$rootScope', function($rootScope) {
	// to create unique board id

	var bid = 3;
	var lid = 3;
	var cid = 5;
	var uid = 0;

	var status = [ {
		id : 'open',
		name : 'Open'
	}, {
		id : 'close',
		name : 'Close'
	} ];

	// boards array to hold list of all boards
	var boards = [];

	var user_boards = [ {
		id : 1,
		name : 'fuu',
		description : 'test board 01',
		lists : [ {
			id : 1,
			board : 1,
			name : "my list",
			cards : [ {
				id : 1,
				list : 1,
				name : "fuu card",
				description : "test desc1",
				status : "open"
			}, {
				id : 2,
				list : 1,
				name : "zumba card",
				description : "test desc2",
				status : "close"
			} ]
		}, {
			id : 2,
			board : 1,
			name : "my list v2",
			cards : [ {
				id : 3,
				list : 2,
				name : "bru card",
				description : "test desc3",
				status : "open"
			}, {
				id : 4,
				list : 2,
				name : "asda card",
				description : "test desc4",
				status : "open"
			} ]
		} ]
	}, {
		id : 2,
		name : 'zu zu',
		description : 'test board 02'
	} ];

	this.init = function(user) {
		// load boards of a specific user
		uid = user.id;
		boards = user_boards;

		$rootScope.$broadcast('boards:updated', boards);
		// console.log(boards);
	};
	
	this.clear = function(){
		boards = [];
		uid = 0;
	}

	this.getCard = function(bid, lid, cid) {
		var list = this.getList(bid, lid);
		for (j in list.cards) {
			if (list.cards[j].id == cid) {
				return list.cards[j];
			}
		}
	};

	this.existCard = function(cid, bid, lid) {
		for (i in boards) {
			if (typeof boards[i].lists !== "undefined")
				for (j in boards[i].lists) {
					if (typeof boards[i].lists[j].cards !== "undefined")
						for (k in boards[i].lists[j].cards) {
							if (boards[i].lists[j].cards[k].id == cid) {
								bid.id = boards[i].id;
								lid.id = boards[i].lists[j].id;
								return boards[i].lists[j].cards[k];
							}
						}
				}
		}
		return null;
	};

	this.removeCard = function(bid, lid, cid) {
		var list = this.getList(bid, lid);
		for (j in list.cards) {
			if (list.cards[j].id == cid)
				list.cards.splice(j, 1);
		}
	};

	this.saveCard = function(bid, card) {
		var lid = card.list;

		var list = this.getList(bid, lid);
		if (card.id == null) {
			card.id = cid++;
			list.cards.push(card);
		} else {
			var oldbid = {};
			var oldlid = {};
			var oldcard = this.existCard(card.id, oldbid, oldlid);
			if (oldcard !== null && oldlid.id != card.list) {
				this.removeCard(oldbid.id, oldlid.id, oldcard.id);
				list.cards.push(card);
			} else {
				for (j in list.cards) {
					if (list.cards[j].id == card.id) {
						list.cards[j] = card;
					}
				}
			}
		}
	};

	this.saveList = function(list) {
		var bid = list.board;
		board = this.get(bid);
		if (list.id == null) {
			list.id = lid++;
			board.lists.push(list);
		} else {
			for (j in board.lists) {
				if (board.lists[j].id == list.id) {
					board.lists[j] = list;
				}
			}
		}
	};

	this.getStatus = function() {
		return status;
	};

	this.getLists = function(bid) {
		return this.get(bid).lists;
	};

	this.getList = function(bid, lid) {
		var board = this.get(bid);
		for (j in board.lists) {
			if (board.lists[j].id == lid) {
				if (typeof board.lists[j].cards === "undefined")
					board.lists[j].cards = [];

				return board.lists[j];
			}
		}
	};

	this.removeList = function(bid, lid) {
		var board = this.get(bid);
		for (j in board.lists) {
			if (board.lists[j].id == lid)
				board.lists.splice(j, 1);
		}
	};

	// save method create a new board if not already exists
	// else update the existing object
	this.save = function(board) {
		if (board.id == null) {
			// if this is new board, add it in boards array
			board.id = bid++;
			boards.push(board);
		} else {
			// for existing board, find this board using id
			// and update it.
			for (i in boards) {
				if (boards[i].id == board.id) {
					boards[i] = board;
				}
			}
		}

	};

	// simply search boards list for given id
	// and returns the board object if found
	this.get = function(id) {
		for (i in boards) {
			if (boards[i].id == id) {
				if (typeof boards[i].lists === "undefined")
					boards[i].lists = [];

				return boards[i];
			}
		}
	};

	// iterate through boards list and delete
	// board if found
	this.remove = function(id) {
		for (i in boards) {
			if (boards[i].id == id) {
				boards.splice(i, 1);
			}
		}
	};

	// simply returns the boards list
	this.list = function() {
		return boards;
	};
} ]);
