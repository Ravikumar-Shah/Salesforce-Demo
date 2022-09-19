public with sharing class TaskListController {

    @AuraEnabled(cacheable = true)
    public static List<Task> getTasks(){        
        return [SELECT Subject FROM Task WHERE OwnerId =: userinfo.getUserId()];        
    }

    @AuraEnabled
    public static Task insertTask(String subject){
        try {        

            Task task = new Task();
            task.Subject = subject;
            task.OwnerId = userinfo.getUserId();
            task.Status = 'Not Started';
            task.Priority = 'Normal';

            insert task;
            return task;
            
        } catch (Exception e) {           
            System.debug(e.getMessage());            
        }
        return null;
    }

    @AuraEnabled
    public static Boolean deleteTask(Id recordId){
        try {
            Database.delete(recordId);
            return true;

        } catch (Exception e) {            
            System.debug(e.getMessage());
        }
        return false;
    }
}
