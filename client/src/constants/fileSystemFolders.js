const fileSystemFolders = {
    info: {
      requirement: 10,
      display: "Info",
      files: {
        directory: {
          requirement: 10,
          display: "building_directory.pdf",
        }
      },
    },
    agreements: {
      requirement: 100,
      display: "Contracts"
    },
    blueprints: {
      requirement: 30,
      display: "Blueprints",
      files: {
        floorPlan1: {
          requirement: 100,
          display: "ground.bp",
        },
        floorPlan2: {
          requirement: 100,
          display: "subfloor1.bp",
        },
        floorPlan3: {
          requirement: 100,
          display: "subfloor2.bp",
        },
        floorPlan4: {
          requirement: 30,
          display: "subfloor3.bp",
        },
        floorPlan5: {
          requirement: 100,
          display: "subfloor4.bp",
        },
      },
    },
    security: {
      requirement: 30,
      display: "Security",
      files: {
        emergencies: {
          requirement: 100,
          display: "emergency_procedures.pdf",
        },
        securityManual: {
          requirement: 30,
          display: "security_invoice.pdf",
        },
        guestPolicy: {
          requirement: 100,
          display: "guest_policy.pdf",
        },
      },
    },
    inventory: {
      requirement: 100,
      display: "Inventory",
    },
    guards: {
      requirement: 50,
      display: "Personnel",
      files: {
        guard1: {
          requirement: 50,
          display: "A_Shakeb.db",
        },
        guard2: {
          requirement: 100,
          display: "B_Elliott.db",
        },
        guard3: {
          requirement: 100,
          display: "D_Hannah.db",
        },
        guard4: {
          requirement: 100,
          display: "D_Mary.db",
        },
        guard5: {
          requirement: 100,
          display: "F_Rian.db",
        },
        guard6: {
          requirement: 100,
          display: "G_Schuyler.db",
        },
        guard7: {
          requirement: 100,
          display: "N_Joseph.db",
        },
        guard8: {
          requirement: 100,
          display: "N_Nelson.db",
        },
        guard9: {
          requirement: 100,
          display: "P_Phoebe.db",
        },
        guard10: {
          requirement: 50,
          display: "W_Patricia.db",
        },
      },
    },
    schedule: {
      requirement: 100,
      display: "Meeting Schedules"
    },
}

export default fileSystemFolders;