import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  Input,
  Button,
  ModalHeader,
  ModalBody,
  Progress,
  useDisclosure,
} from "@nextui-org/react";

//Controller for API ENDPOINT
import axiosInstance from "@/config/axiosInstance";

// Emmiter
import emitter from "../../../../util/emitter.js";

const DeliveryItemQuantityEditBtn = ({
  deliveryItemId,
  stockId,
  currentQuantity,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State to store the quantity input and error message
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle quantity input change
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  // Handle edit quantity action
  const handleEditQuantity = async () => {
    setLoading(true);
    // Validate quantity input
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      setError("Please provide a valid quantity.");
      return;
    }

    try {
      const response = await axiosInstance.put(
        `/api/deliveryItems/editDeliveryItemQuantity/${deliveryItemId}`,
        {
          delivery_quantity: quantity,
        }
      );

      // Check the difference in quantity
      const difference = quantity - currentQuantity;

      // Update the stock quantity
      if (difference > 0) {
        // New quantity is greater: decrease stock
        await axiosInstance.put(
          `/api/stocks/decreaseStockQuantity/${stockId}`,
          {
            quantity: difference,
          }
        );
      } else if (difference < 0) {
        // New quantity is smaller: increase stock
        await axiosInstance.put(
          `/api/stocks/increaseStockQuantity/${stockId}`,
          {
            quantity: Math.abs(difference),
          }
        );
      }

      // Check if the update was successful
      if (response.status === 200) {
        emitter.emit("deliveryItemQuantityUpdated");
        setError(""); // Clear error message if the request is successful
        setQuantity(""); // Clear the quantity field after success
        onClose(); // Close the modal after successful update
      } else {
        setError("Failed to update item quantity. Please try again.");
      }
    } catch (error) {
      console.error("Error updating delivery item:", error.message);
      setError("Failed to update item quantity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onPress={onOpen} size="sm" className="bg-black text-white">
        Edit
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onClose} size="sm">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 font-f1">
            <h1 className="text-2xl font-bold">Edit Quantity</h1>
          </ModalHeader>
          <ModalBody>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Progress
                  isIndeterminate
                  aria-label="Loading data..."
                  className="w-full mb-4 font-f1"
                  size="sm"
                  label="Changing Quantity..."
                />
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevent default form submission
                  handleEditQuantity();
                }}
              >
                <Input
                  type="number"
                  size="lg"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="font-f1"
                  label="Enter New Quantity"
                  required
                />
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && (
                  <p className="text-green-500">{successMessage}</p>
                )}
                <Button
                  type="submit"
                  className="mt-8 mb-8 font-f1 bg-black text-white"
                >
                  Update Quantity
                </Button>
              </form>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeliveryItemQuantityEditBtn;
