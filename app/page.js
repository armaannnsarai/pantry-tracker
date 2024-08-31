"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
} from "@mui/material";
import {
  collection,
  query,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { firestore } from "@/firebase";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      bgcolor="background.default"
      p={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="background.paper"
          borderRadius={4}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6" color="text.primary">
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
              sx={{ borderRadius: 2 }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add New Item
      </Button>

      <Box border="1px solid #333" borderRadius={2} overflow="hidden">
        <Box
          width="800px"
          height="100px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="black"
        >
          <Typography variant="h2">Inventory Items</Typography>
        </Box>

        <Stack width="800px" spacing={2} overflow="auto">
          {inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              padding={3}
              borderRadius={2}
              bgcolor="background.default"
              boxShadow={1}
              sx={{ transition: "0.3s", "&:hover": { boxShadow: 3 } }}
            >
              <Typography
                variant="h3"
                color="text.primary"
                textAlign="center"
                flex={1}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h3"
                color="text.secondary"
                textAlign="center"
              >
                {quantity}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => addItem(name)}
                  sx={{ borderRadius: 2 }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => removeItem(name)}
                  sx={{ borderRadius: 2 }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
