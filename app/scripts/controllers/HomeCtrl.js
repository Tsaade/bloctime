(function() {
    'use strict'
    
    function HomeCtrl($scope, $firebaseArray, $interval, Tasks) {        
        var timerRef = firebase.database().ref().child('timer_tasks');        
        $scope.timer_tasks = $firebaseArray(timerRef);

        $scope.isRunning = false;
        $scope.taskTimer = 25 * 60;
        $scope.shortBreak = 5 * 60;
        $scope.longBreak = 30 * 60;
        $scope.countDown = $scope.taskTimer;
        $scope.longBreakCounter = 0;
        $scope.tasks = Tasks.all;
        
        $scope.timerDing = new buzz.sound( "/assets/sounds/Ding.mp3", {
            preload: true
        });
        
        
        $scope.startTimer = function() {
            $scope.isRunning = true;
            $scope.button = 'Stop';

            $scope.timerPromise = $interval(function(task) { 
                $scope.countDown--; 

                if ($scope.countDown == 0) {
                    $interval.cancel($scope.timerPromise);
                    $scope.isRunning = false;
                    $scope.isWorkSession = false;
                    $scope.button = 'Start';
                    $scope.timerDing.play();
                
                    if (!$scope.isBreakTime) {
                        $scope.longBreakCounter++;
                        $scope.addHistory();
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
        
        $scope.stopTimer = function() {
            $interval.cancel($scope.timerPromise);
            $scope.countDown = $scope.taskTimer;
            $scope.button = "Start"
            $scope.isRunning = false;
        };
        
        $scope.addHistory = function() {
            var taskText = $('#text-field').val();
            $scope.timer_tasks.$add({
                taskText: taskText,
                completed: Date.now()
            });
            $('#text-field').val('');
        };
        
        $scope.clearTasks = function() {
            Tasks.clearTasks();
        }
    }
    
    angular
        .module('bloctime')
        .controller('HomeCtrl', ['$scope', '$firebaseArray', '$interval', 'Tasks', HomeCtrl]);
})();

/* Keep for furture reference:
*        $scope.addTask = function() {
*            var task = {
*                taskText: $scope.taskText,
*            };
*            //console.log(task); //this is a local variable and thus doesn't resolve the task issue!
*            $scope.timer_tasks.$add(task).then(function(timerRef) { 
*                $scope.taskText = '';
*            });
*        };
*/