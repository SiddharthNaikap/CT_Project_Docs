Batch Apex
#########
Syntax for Batch apex:
#############
global class MyBatchClass implements Database.Batchable {

    global (Database.QueryLocator | Iterable) start(Database.BatchableContext bc) {
        // collect the batches of records or objects to be passed to execute
    }

    global void execute(Database.BatchableContext bc, List records) {
        // process each batch of records
   }
   global void finish(Database.BatchableContext bc){
// execute any post-processing operations
    }

}
Syntax for Invoking a Batch apex class:
######################
MyBatchClass myBatchObject = new MyBatchClass();

Id batchId = Database.executeBatch(myBatchObject);

with record limit(default 200)
Id batchId = Database.executeBatch(myBatchObject, 100);

Example:
###########
global class BatchApexExample implements Database.Batchable<sObject> {
    global Database.QueryLocator start(Database.BatchableContext BC) {
        // collect the batches of records or objects to be passed to execute
         
        String query = 'SELECT Id, Name FROM Account';
        return Database.getQueryLocator(query);
    }
     
    global void execute(Database.BatchableContext BC, List<Account> accList) {
        
        // process each batch of records default size is 200
        for(Account acc : accList) {        
            // Update the Account Name 
            acc.Name = acc.Name + 'sfdcpoint';
        }
        try {
            // Update the Account Record
            update accList;
         
        } catch(Exception e) {
            System.debug(e);
        }
         
    }   
     
    global void finish(Database.BatchableContext BC) {
        // execute any post-processing operations like sending email
    }
}

Scheduling Batch Apex:
######################
global class scheduledBatchable implements Schedulable {
   global void execute(SchedulableContext sc) {
      BatchApexExample b = new BatchApexExample(); 
      Database.executeBatch(b);
   }
}

Test Class for Batch Apex:
###########################
@isTest
private class BatchApexExampleTest {
    static testmethod void test() {
        // Create test accounts to be updated by batch
    Account[] accList = new List();
    for (Integer i=0;i<400;i++) {
        Account ac = new Account(Name = 'Account ' + i);
        accList.add(ac);
    }
    insert accList;
 
        Test.startTest();
            BatchApexExample b = new BatchApexExample();
        Database.executeBatch(b);
        Test.stopTest();
        // Verify accounts updated
    Account[] accUpdatedList = [SELECT Id, Name FROM Account];
    System.assert(accUpdatedList[0].Name.Contains('sfdcpoint'));
    }
}



Sample Batch apex code:
#########################
global class UpdateContactAddresses implements Database.Batchable, Database.Stateful {

  // instance member to retain state across transactions

    global Integer recordsProcessed = 0;

    global Database.QueryLocator start(Database.BatchableContext bc) {

      return Database.getQueryLocator(

            ‘SELECT ID, BillingStreet, BillingCity, BillingState, ‘ +

            ‘BillingPostalCode, (SELECT ID, MailingStreet, MailingCity, ‘ +

           ‘MailingState, MailingPostalCode FROM Contacts) FROM Account ‘ +

            ‘Where BillingCountry = \’USA\”

       );

    }

   global void execute(Database.BatchableContext bc, List scope){

       // process each batch of records

List contacts = new List();

  for (Account account : scope) {

           for (Contact contact : account.contacts) {

                contact.MailingStreet = account.BillingStreet;

              contact.MailingCity = account.BillingCity;

               contact.MailingState = account.BillingState;

                contact.MailingPostalCode = account.BillingPostalCode;

                // add contact to list to be updated

                contacts.add(contact);

                // increment the instance member counter

                recordsProcessed = recordsProcessed + 1;

            }

        }

        update contacts;

    }

    global void finish(Database.BatchableContext bc){

        System.debug(recordsProcessed + ‘ records processed. Shazam!’);

        AsyncApexJob job = [SELECT Id, Status, NumberOfErrors,

            JobItemsProcessed,

           TotalJobItems, CreatedBy.Email

            FROM AsyncApexJob

           WHERE Id = :bc.getJobId()];

        // call some utility to send email

      EmailUtils.sendMessage(job, recordsProcessed);

    }

}