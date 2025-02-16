import React from "react";
import CreateCashBillButton from "./CreateCashBill";
import { Tabs, Tab } from "@nextui-org/tabs";
import Gasket_CashBillTable from "./gasket_CashBillTable";
import Ring_CashBillTable from "./rings_CashBillTable";
import CashInvoice from "./cash_Invoice";

const CashBills = () => {
  return (
    <div className="relative">
      
      <Tabs
        aria-label="Items"
        className="font-f1 ml-2"
        size="sm"
        variant="bordered"
        color="danger"
      >
        <Tab key="gaskets" title="GASKETS">
          <Gasket_CashBillTable />
        </Tab>
        <Tab key="rings" title="RINGS">
          <Ring_CashBillTable />
        </Tab>
        <Tab key="bearings" title="BEARINGS">
          NO DATA
        </Tab>
        <Tab key="sleeve" title="SLEEVE SETS">
          NO DATA
        </Tab>
      </Tabs>

      <CreateCashBillButton />

      <CashInvoice />
    </div>
  );
};

export default CashBills;
