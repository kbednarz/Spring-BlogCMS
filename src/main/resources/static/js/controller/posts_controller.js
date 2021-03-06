'use strict';


App.controller('PostsController', ['$scope','$location','PostsService', function($scope, $location, PostsService) {
    var self = this;
    self.postEntity={id:null,author:'',title:'',content:'',date:''};
    self.postList=[];


    self.fetchAllPosts = function(){
        PostsService.fetchAllPosts()
            .then(
                function(d) {
                    self.postList = d;
                },
                function(errResponse){
                    console.error('Error while fetching posts');
                }
            );
    };

    self.fetchSpecificPost = function(id){
        PostsService.fetchSpecificPost(id)
            .then(
                function(d) {
                    self.postEntity = d;
                },
                function(errResponse){
                    console.error('Error while fetching specific post');
                }
            );
    };

    self.createPost = function(postEntity){
        PostsService.createPost(postEntity)
            .then(
                self.fetchAllPosts,
                function(errResponse){
                    console.error('Error while creating post.');
                }
            );
    };

    self.updatePost = function(postEntity, id){
        PostsService.updatePost(postEntity, id)
            .then(
                self.fetchAllPosts,
                function(errResponse){
                    console.error('Error while updating post.');
                }
            );
    };

    self.deletePost = function(id){
        PostsService.deletePost(id)
            .then(
                self.fetchAllPosts,
                function(errResponse){
                    console.error('Error while deleting post.');
                }
            );
    };

    self.fetchAllPosts();

    self.submit = function() {
        if(self.postEntity.id===null){
            console.log('Saving new post', self.postEntity);
            self.createPost(self.postEntity);
        }else{
            self.updatePost(self.postEntity, self.postEntity.id);
            console.log('Post updated with id ', self.postEntity.id);
        }
        self.reset();
    };

    self.edit = function(id){
        console.log('id to be edited', id);
        for(var i = 0; i < self.postList.length; i++){
            if(self.postList[i].id === id) {
                self.postEntity = angular.copy(self.postList[i]);
                break;
            }
        }
    };

    self.remove = function(id){
        console.log('id to be deleted', id);
        if(self.postEntity.id === id) {//clean the form if the postEntity to be deleted is shown there.
            self.reset();
        }
        self.deletePost(id);
    };

    self.reset = function(){
        self.postEntity={id:null,author:'',title:'',content:'',date:''};
        $scope.postForm.$setPristine(); //reset Form
    }

    self.showPostFromParam = function () {
        var postId = $location.search().postId;
        if(postId){
            self.fetchSpecificPost(postId);
        }
    }


}])
    .config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
        $routeProvider
            .when("/post/:postId",
            {
                template: "/post",
                controller: "SpecificPostController"
            }
        );
        $locationProvider.html5Mode(true);

    }])

    .controller('SpecificPostController',['$scope','$routeParams','PostsService', function($scope,$routeParams,PostsService) {
        var postId = $routeParams.postId;
        $scope.postEntity={id:null,author:'',title:'',content:'',date:''};
        if(postId){
        PostsService.fetchSpecificPost(postId)
            .then(
                function(d) {
                    $scope.postEntity = d;
                },
                function(errResponse){
                    console.error('Error while fetching specific post');
                }
            )
        }
    }])

    .directive('confirmationNeeded', function () {
    return {
        priority: 1,
        terminal: true,
        link: function (scope, element, attr) {
            var msg = attr.confirmationNeeded || "Are you sure?";
            var clickAction = attr.ngClick;
            element.bind('click',function () {
                if ( window.confirm(msg) ) {
                    scope.$eval(clickAction)
                }
            });
        }
    };
});;

