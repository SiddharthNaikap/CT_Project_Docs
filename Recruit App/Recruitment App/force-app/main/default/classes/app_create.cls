public class app_create {
      public static string createApplication(String posCode, String candCode){       
        Application__c application = new Application__c(
            Position_Code__c = posCode,
            Candidate_Code__c =candCode
             );
        insert application;
        ID applicationID = application.ID;
        return applicationID;
    }
}