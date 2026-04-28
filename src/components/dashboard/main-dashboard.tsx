// import { WelcomeCard } from "./welcome-card";
// import { RoomCard } from "./room-card";
// import { DeviceCard } from "./device-card";
// import { AirConditioning } from "./air-conditioning";
// import { UsersWidget } from "./users";
// import { ConsumptionChart } from "./consumption-chart";
// import { Shortcuts } from "./shortcuts";
// import { LightPanels } from "./light-panels";
// import { Scenes } from "./scenes";
// import EnergyWidget from "./energy-widget";

export function MainDashboard() {
  return (
    <div className="space-y-5">
      <WelcomeCard />

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Left big column */}
        <div className="space-y-5 lg:col-span-2">
          {/* Rooms */}
          <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Rooms</h2>
              <span className="text-[10px] text-muted-foreground">
                Master bed room ▾
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {[
                "Living Room",
                "Kitchen",
                "Bed Room",
                "Bathroom",
                "Bed Room",
                "Bathroom",
              ].map((r, i) => (
                <RoomCard key={i} title={r} />
              ))}
            </div>
          </section>

          {/* Popular Devices + Scenes */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">
                  Popular Devices
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DeviceCard title="Refrigerator" icon="fridge" />
                <DeviceCard title="Washer" icon="washer" />
                <DeviceCard title="Desktop PC" icon="pc" />
                <DeviceCard title="Air Conditioning" icon="ac" />
              </div>
            </div>
            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Scene</h2>
              </div>
              <Scenes />
            </div>
          </section>

          {/* New energy/temperature widget inspired by provided design */}
          <EnergyWidget />
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <AirConditioning />
          <UsersWidget />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ConsumptionChart />
        </div>
        <Shortcuts />
      </div>

      <LightPanels />
    </div>
  );
}
