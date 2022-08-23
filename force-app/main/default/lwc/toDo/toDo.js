
// Created by Ravikumar Shah. Last updated on 23/08/22

import { LightningElement, track, wire } from 'lwc';
import getTasks from '@salesforce/apex/TaskListController.getTasks';

export default class ToDo extends LightningElement {

    // Variable to store a new task.
    newTask = "";

    // An Array to store tasks.
    @track
    newToDoTasks = [];

    // This function assigns text in input field to a variable to add in array.
    updateTask(event) {
        this.newTask = event.target.value;
        //console.log(this.newTask);
    }

    // This function updates the array of tasks and clears input field.
    addNewTask(event) {
        this.newToDoTasks.push({
            id: this.newToDoTasks.length + 1,
            name: this.newTask,
        });
        this.newTask = "";
        //console.log(this.newToDoTasks);
    }

    // This function deletes the selected task.
    deleteTask(event) {
        let idToDelete = event.target.name;
        for (let i = 0; i < this.newToDoTasks.length; i++) {
            if (this.newToDoTasks[i].id === idToDelete) {
                this.newToDoTasks.splice(i, 1);
            }
        }
    }

    @wire(getTasks)
    getTasksToDo(response) {
        let data = response.data;
        let error = response.error;
        if(data){
            console.log(data);
        } else if(error){
            console.log(error);
        }
    }
}