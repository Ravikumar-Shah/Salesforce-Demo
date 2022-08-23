public with sharing class TaskListController {
    // public TaskListController() {

    // }

    //This function returns list of tasks. 
    @AuraEnabled(cacheable = true)
    public static List<Task> getTasks(){
        try {
            return [SELECT Subject FROM Task WHERE OwnerId =: userinfo.getUserId()];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
   
}
