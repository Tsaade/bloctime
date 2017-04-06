(function() {
    'use strict'
    
    function HomeCtrl($scope, $firebaseArray, $interval) {        
        var timerRef = firebase.database().ref().child('timer_tasks');        
        $scope.timer_tasks = $firebaseArray(timerRef);

        $scope.isRunning = false;
        $scope.isBreakTIme = false;
        $scope.button = "Start";
        $scope.taskTimer = 25 * 60;
        $scope.shortBreak = 5 * 60;
        $scope.longBreak = 30 * 60;
        $scope.countDown = $scope.taskTimer;
        $scope.longBreakCounter = 0;
        
        $scope.timerDing = new buzz.sound( "/assets/sounds/Ding.mp3", {
            preload: true
        });

        $scope.addTask = function() {
            var task = {
                taskText: $scope.taskText,
            };
            //console.log(task); //this is a local variable and thus doesn't resolve the task issue!
            $scope.timer_tasks.$add(task).then(function(timerRef) { 
                $scope.taskText = '';
            });
        };
        
        $scope.startTimer = function() {
            $scope.isRunning = true;
            $scope.button = 'Stop';

            $scope.timerPromise = $interval(function(task) { 
                $scope.countDown--; 

                if ($scope.countDown == 0) {
                    $interval.cancel($scope.timerPromise);
                    $scope.isRunning = false;
                    $scope.button = 'Start';
                    $scope.timerDing.play();
                
                    if (!$scope.isBreakTime) {
                        $scope.longBreakCounter++;
                        console.log($scope.longBreakCounter);
                        $scope.isBreakTime = true;
                    
                        if ($scope.longBreakCounter % 4 === 0) {
                            $scope.countDown = $scope.longBreak;
                        } else {
                            $scope.countDown = $scope.shortBreak;
                        }
                    } else {
                        $scope.countDown = $scope.taskTimer;
                        $scope.isBreakTime = false;
                    }
                    $scope.isRunning = false;
                    $scope.button = 'Start';
                }
            },1000);
        };
        
        $scope.stopTimer = function(task) {
            $interval.cancel($scope.timerPromise);
            $scope.countDown = $scope.taskTimer;
            $scope.button = "Start"
            $scope.isRunning = false;
        };
    }
    
    angular
        .module('bloctime')
        .controller('HomeCtrl', ['$scope', '$firebaseArray', '$interval', HomeCtrl]);
})();