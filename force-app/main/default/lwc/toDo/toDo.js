
// Created by Ravikumar Shah. Last updated on 19/09/22

import { LightningElement, track, wire } from 'lwc';
import getTasks from '@salesforce/apex/TaskListController.getTasks';
import { refreshApex } from '@salesforce/apex';
import insertTask from '@salesforce/apex/TaskListController.insertTask';
import deleteTask from '@salesforce/apex/TaskListController.deleteTask';

export default class ToDo extends LightningElement {

    // Variable to store a new task.
    newTask = "";

    // An Array to store tasks.
    @track
    newToDoTasks = [];

    // To store response from salesforce org after running query.
    toDoTaskResponse;

    // A spinner to show system is processing. It is used to make user aware about backend processing.
    spinner;

    // This function assigns text in input field to a variable to add in array.
    updateTask(event) {
        this.newTask = event.target.value;        
    }

    // This function updates the array of tasks and clears input field.
    addNewTask(event) {        
        if(this.newTask!= ""){
            this.spinner = true;
            insertTask({subject: this.newTask})
            .then(result => {
                this.spinner = false;
                
                this.newToDoTasks.push({
                    //Before assigning id, an array's length is used to check whether its empty.
                    //0 is assigned to id in case array is empty.
                    id: this.newToDoTasks[this.newToDoTasks.length - 1] ? this.newToDoTasks[this.newToDoTasks.length - 1].id + 1 : 0,
                    name: this.newTask,
                    recordId: result.Id,
                });
                this.newTask = "";
            })
            .catch(error => {
                window.alert(error);
                this.spinner = false;
            });
        } 
    }

    // This function deletes the selected task.
    deleteTask(event) {
        let idToDelete = event.target.name;
        let recordIdToDelete;
        let indexToDelete;

        this.spinner = true;
        for (let i = 0; i < this.newToDoTasks.length; i++) {
            if (this.newToDoTasks[i].id === idToDelete) {
                recordIdToDelete = this.newToDoTasks[i].recordId;
                indexToDelete = i;                
            }
        }
        
        deleteTask({recordId: recordIdToDelete})
        .then(result => {            
            if(result){
                this.newToDoTasks.splice(indexToDelete, 1);                
            }else {
                window.alert("Failed to delete. Please try again");
            }
            this.spinner = false;
        })
        .catch(error => {
            this.spinner = false;
            window.alert(error);
        });        
    }    

    // This function gets data from org. 
    @wire(getTasks)
    getToDoTasks(response){
        this.toDoTaskResponse = response;
        let data = response.data;
        let error = response.error;

        if(response){
            this.spinner = false;
        }

        if(data){            
            this.newToDoTasks = [];
            data.forEach(task => {
                this.newToDoTasks.push({
                    id: this.newToDoTasks.length + 1,
                    name: task.Subject,
                    recordId: task.Id,
                });
            }); 
        }else if(error){            
            window.alert(error);
        }
    }

    //This function refresh the list. 
    refreshTodoList() {
        this.spinner = true;
        refreshApex(this.toDoTaskResponse)
        .finally(() =>  this.spinner = false);
    }
}