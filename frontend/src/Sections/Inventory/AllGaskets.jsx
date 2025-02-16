import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Input,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Progress,
} from "@nextui-org/react";
import axiosInstance from "@/config/axiosInstance";
import { User, Link } from "@nextui-org/react";
import Delete_Gasket from "@/components/Inventory_Components/DeleteGasket.jsx";
import { toast } from "react-toastify";

//Buttons
import Adjust_Stock_Button from "@/components/Inventory_Components/Adjust_Stock_Button";

//Emitter
import emitter from "../../../util/emitter.js";

const AllGaskets = () => {
  const [gaskets, setGaskets] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch the list of gaskets
  useEffect(() => {
    const fetchGaskets = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get("/api/gaskets");
        setGaskets(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching gaskets:", error);
      }
    };

    // Fetch the list of branches
    const fetchBranches = async () => {
      try {
        const response = await axiosInstance.get("/api/branches");
        setBranches(response.data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };

    fetchGaskets();
    fetchBranches();

    //Show toast when gasket is deleted
    const gasketDeletedListener = () => {
      fetchGaskets();
      toast.success("Gasket deleted successfully!");
    };

    // Register the stockUpdated event listener
    emitter.on("stockUpdated", fetchGaskets);
    emitter.on("gasketDeleted", gasketDeletedListener);

    // Cleanup the event listener on component unmount
    return () => {
      emitter.off("stockUpdated", fetchGaskets);
      emitter.off("gasketDeleted", gasketDeletedListener);
    };
  }, []);

  // Filter gaskets based on branch and search term
  const filteredGaskets = gaskets.filter((gasket) => {
    const searchWords = searchTerm.trim().toLowerCase().split(/\s+/);
    const matchesBranch =
      !selectedBranch ||
      gasket.stock.some((stock) => stock.branch?.name === selectedBranch);
    const matchesSearchTerm = searchWords.every(
      (word) =>
        gasket.part_number.toLowerCase().includes(word) ||
        gasket.engine?.engine_name.toLowerCase().includes(word) ||
        gasket.packing_type.toLowerCase().includes(word) ||
        gasket.material_type.toLowerCase().includes(word) ||
        gasket.vendor?.vendor_name.toLowerCase().includes(word)
    );
    return matchesBranch && matchesSearchTerm;
  });

  // Render stock details
  const renderStockDetails = (gasket) => {
    if (selectedBranch) {
      const selectedStock = gasket.stock.find(
        (stock) => stock.branch?.name === selectedBranch
      );
      return (
        <div>
          <p>{selectedStock?.quantity || "N/A"}</p>
        </div>
      );
    }

    return (
      <Table aria-label="Stock details" className="min-w-[300px]" isStriped>
        <TableHeader>
          <TableColumn>Branch</TableColumn>
          <TableColumn>Quantity</TableColumn>
          <TableColumn>Last Updated</TableColumn>
        </TableHeader>
        <TableBody>
          {gasket.stock.map((stock) => (
            <TableRow key={stock._id}>
              <TableCell>{stock.branch?.name || "N/A"}</TableCell>
              <TableCell>{stock.quantity}</TableCell>
              <TableCell>{stock.updated_by || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="container">
      {isLoading ? (
        <Progress
          isIndeterminate
          aria-label="Deleting gasket..."
          size="sm"
          label="Loading Gaskets"
          className="font-f1"
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="mb-6">
              <h2 className="text-sm font-f1 mb-2">Select Branch</h2>
              <Tabs
                aria-label="Branch Filter"
                selectedKey={selectedBranch}
                onSelectionChange={(key) => setSelectedBranch(key)}
                variant="bordered"
                color="primary"
                className="font-f1"
                size="sm"
              >
                {branches.map((branch) => (
                  <Tab key={branch.name} title={`${branch.name} Branch`} />
                ))}
              </Tabs>
            </div>

            <div className="mb-6">
              <h2 className="text-sm font-f1 mb-2 w-[300px]">Search Gaskets</h2>
              <Input
                aria-label="Search Gaskets"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Part Number, Description..."
                variant="bordered"
                className="font-f1"
                fullWidth
                size="md"
              />
            </div>
          </div>

          <Table aria-label="Gaskets inventory" className="mb-6">
            <TableHeader>
              <TableColumn className="text-sm font-f1">Part Number</TableColumn>
              <TableColumn className="text-sm font-f1">Description</TableColumn>
              <TableColumn className="text-sm font-f1">Brand</TableColumn>
              <TableColumn className="text-sm font-f1">
                {selectedBranch ? `${selectedBranch} Stock` : "Stock"}
              </TableColumn>
              <TableColumn className="text-sm font-f1">
                Last Updated By
              </TableColumn>
              <TableColumn className="text-sm font-f1">
                Stock Adjustment
              </TableColumn>
              <TableColumn className="text-sm font-f1">Deletions</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredGaskets.map((gasket) => (
                <TableRow key={gasket._id} className="font-f1">
                  <TableCell>{gasket.part_number}</TableCell>
                  <TableCell>
                    {gasket.engine?.engine_name} {gasket.packing_type}{" "}
                    {gasket.material_type}{" "}
                    <Chip
                      color="primary"
                      size="sm"
                      variant="bordered"
                      className="ml-4"
                    >
                      {gasket.vendor?.vendor_name}
                    </Chip>
                  </TableCell>
                  <TableCell>{gasket.brand?.brand_name}</TableCell>
                  <TableCell>{renderStockDetails(gasket)}</TableCell>
                  <TableCell>
                    <User
                      avatarProps={{
                        src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                      }}
                      description={
                        <Link
                          isExternal
                          href="https://x.com/jrgarciadev"
                          size="sm"
                        >
                          @LoggedUserEmail
                        </Link>
                      }
                      name="Logged User"
                    />
                  </TableCell>
                  <TableCell>
                    {selectedBranch ? (
                      // If a branch is selected, find the stock for that branch
                      gasket.stock.some(
                        (stock) => stock.branch?.name === selectedBranch
                      ) ? (
                        gasket.stock
                          .filter(
                            (stock) => stock.branch?.name === selectedBranch
                          )
                          .map((selectedStock) => (
                            <Adjust_Stock_Button
                              key={selectedStock._id}
                              stockid={selectedStock._id}
                              currentStock={selectedStock.quantity || 0}
                            />
                          ))
                      ) : (
                        <p>No stock available for {selectedBranch}</p>
                      )
                    ) : (
                      // If no branch is selected, display all stock options with action buttons
                      gasket.stock.map((stock) => (
                        <Adjust_Stock_Button
                          key={stock._id}
                          stockid={stock._id}
                          currentStock={stock.quantity || 0}
                        />
                      ))
                    )}
                  </TableCell>
                  <TableCell>
                    <Delete_Gasket
                      gasketId={gasket._id}
                      engine={gasket.engine?.engine_name}
                      brand={gasket.brand?.brand_name}
                      packing={gasket.packing_type}
                      material={gasket.material_type}
                      vendor={gasket.vendor?.vendor_name}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default AllGaskets;
