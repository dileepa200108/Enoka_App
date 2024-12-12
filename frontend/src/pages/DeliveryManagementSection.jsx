import { Sidebar } from "../components/Dashboard_Components/Sidebar";
import { Header } from "../pages/Header";

//New Delivery
import DeliverySystem from "./DeliverySystem";

//On Delivery
import OnDeliveryTable from "../components/Delivery_Components/onDeliveryTable";

//Received
import ReceivedDeliveryTable from "@/components/Delivery_Components/receivedDeliveryTable";

import { Tabs, Tab } from "@nextui-org/react";

export function DeliveryManagement() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Tabs className="font-f1" size="lg" variant="bordered" color="danger">
            <Tab key="deliverySystem" title="New Delivery">
              <DeliverySystem />
            </Tab>
            <Tab key="ondelivery" title="On Delivery">
              <OnDeliveryTable />
            </Tab>
            <Tab key="Received" title="Received">
              <ReceivedDeliveryTable />
            </Tab>
            <Tab key="Reports" title="Reports">
              Reports
            </Tab>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
