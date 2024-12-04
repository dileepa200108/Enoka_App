import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import axios from "axios";

const ItemAddToDeliveryButton = ({ item_id, delivery_id }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle form submission for new delivery item creation
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (!quantity || isNaN(quantity) || quantity <= 0) {
      setError("Please provide a valid quantity.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8098/api/deliveryItems/createDeliveryItem",
        {
          item: item_id, // Use the item_id passed as a prop
          quantity: quantity,
          deliveryId: delivery_id, // Use the delivery_id passed as a prop
        }
      );

      // Check if the delivery item creation was successful
      if (response.status === 201) {
        setSuccessMessage("Delivery item added successfully!");
        setError(""); // Clear error message if the request is successful
        setQuantity(""); // Clear the quantity field after success
        onOpenChange(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating delivery item:", error.message);
      setError("Failed to add item to delivery. Please try again.");
      setSuccessMessage(""); // Clear success message if there's an error
    }
  };

  // Reset form when the modal is closed
  const handleClose = () => {
    setQuantity(""); // Reset quantity
    setError(""); // Reset error message
    setSuccessMessage(""); // Reset success message
  };

  return (
    <>
      <Button onPress={onOpen}>Add to Delivery</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Add Item to Delivery
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                labelPlaceholder="Quantity"
                required
              />
              {error && <p className="text-red-500">{error}</p>}
              {successMessage && (
                <p className="text-green-500">{successMessage}</p>
              )}
              <Button type="submit" className="mt-8">Add Item</Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ItemAddToDeliveryButton;
