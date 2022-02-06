# selector

handle all mergedObj validation that require entire obj (c require id, p require pn)
handle only mir issue (set to specific queue)
choose which record sent to buildROGD (new or all one by one)

QUEUES

- merger --> selector: SELECTOR_QUEUE
- recovery --> selector: RECOVERY_QUEUE
- selector --> buildEntity: BUILD_ENTITY_QUEUE
- selector --> buildROGD(normal flow): BUILD_ROGD_QUEUE
- selector --> buildROGD(Mir flow): BUILD_ROGD_MIR_QUEUE

- mergedObject EXAMPLE
- mergedObj :{
-       "_id" : ObjectId("61b9fe3272aeff3cbe6c0ed9"),
        "aka" : [
            {
                "record" : {
                    "firstName" : "Lucie",
                    "lastName" : "Rutherford",
                    "personalNumber" : "2615048",
                    "clearance" : "3",
                    "rank" : "champion",
                    "dischargeDay" : "2025-05-14T04:20:52.191Z",
                    "akaUnit" : "mordor",
                    "birthDate" : "2016-09-01T19:52:53.303Z",
                    "sex" : "female",
                    "source" : "aka"
                },
                "dataSource" : "aka",
                "runUID" : "21535a21-faad-4d68-ac6e-131ff937058f",
                "updatedAt" : ISODate("2021-12-15T14:39:46.817Z")
            }
        ],
        "es_name" : [
            {
                "record" : { .... },
                "dataSource" : "es_name",
                "runUID" : "21535a21-faad-4d68-ac6e-131ff937058f",
                "updatedAt" : ISODate("2021-12-15T14:39:46.817Z")
            }
        ],
        "identifiers" : {
            "personalNumber" : "2615048"
            "identityCard" : "2615048"
        },
        "updatedAt" : ISODate("2021-12-15T14:39:46.817Z"),
        "lock" : 0
  }

sent to BUILD_ENTITY_QUEUE
- sent mergerObj

sent to BUILD_ROGD_QUEUE & BUILD_ROGD_MIR_QUEUE
- single record: {
- "firstName" : "Lucie",
- "lastName" : "Rutherford",
- "personalNumber" : "2615048",
- "clearance" : "3",
- "rank" : "champion",
- "dischargeDay" : "2025-05-14T04:20:52.191Z",
- "akaUnit" : "mordor",
- "birthDate" : "2016-09-01T19:52:53.303Z",
- "sex" : "female",
- "source" : "aka"
- }
