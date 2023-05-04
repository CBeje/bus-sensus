import * as React from "react";
import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Card,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  FormHelperText,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { timeStamp } from "./utils";
import { nanoid } from "nanoid";

export default function Form() {
  const [line, setLine] = useState([]);
  const [selectedLine, setSelectedLine] = useState("");
  const [route, setRoute] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [station, setStation] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [open, setOpen] = useState(false);
  const [postData, setPostData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://random-data-api.com/api/users/random_user?size=10"
        );
        const data = await response.json();

        setLine(
          data.map((item) => {
            return item.subscription.plan;
          })
        );
        setRoute(
          data.map((item) => {
            return item.address.city;
          })
        );

        setStation(
          data.map((item) => {
            return item.address.street_name;
          })
        );
      } catch (error) {
        console.error(error);
        setErrorMessage("Eroare de comunicare cu serverul !");
      }
    }
    fetchData();
  }, []);

  function validateForm() {
    if (
      selectedLine === "" ||
      selectedRoute === "" ||
      selectedStation === "" ||
      totalPassengers === ""
    ) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const userId = nanoid();
    const time = timeStamp(new Date());
    setTotalPassengers(0);
    console.log(
      selectedLine,
      selectedRoute,
      selectedStation,
      totalPassengers,
      time,
      `user id: ${userId}`
    );

    const handlePost = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("https://api.restful-api.dev/objects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            linia: selectedLine,
            ruta: selectedRoute,
            statia: selectedStation,
            numarPasageri: totalPassengers,
            ora: time,
            id: userId,
          }),
        });

        const data = await response.json();
        setPostData(data);
        setOpen(true);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    handlePost();
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <>
      {line.length === 0 ? (
        <Alert severity="error">{message}</Alert>
      ) : (
        <div>
          <Box m={2} pt={3}>
            <Card elevation={2}>
              <h2>BusSensus</h2>
              <Stack spacing={4} m={4}>
                <FormControl>
                  <InputLabel id="linia-label">Linia</InputLabel>
                  <Select
                    labelid="linia-label"
                    value={selectedLine || " "}
                    id="Linia"
                    label="Linia"
                    onChange={(e) => setSelectedLine(e.target.value)}
                  >
                    {line.map((line) => {
                      return (
                        <MenuItem key={nanoid()} value={line}>
                          {line}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl>
                  <InputLabel id="ruta-label">Ruta</InputLabel>
                  <Select
                    labelid="ruta-label"
                    value={selectedRoute || " "}
                    disabled={!selectedLine}
                    id="Ruta"
                    label="Ruta"
                    onChange={(e) => setSelectedRoute(e.target.value)}
                  >
                    {route.map((route) => {
                      return (
                        <MenuItem key={nanoid()} value={route}>
                          {route}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {!selectedLine && (
                    <FormHelperText>
                      Selecteaza linia autobuzului mai intai.
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <InputLabel id="statia-label">Statia</InputLabel>
                  <Select
                    labelid="statia-label"
                    value={selectedStation || " "}
                    disabled={!selectedRoute}
                    id="Statia"
                    label="Statia"
                    onChange={(e) => setSelectedStation(e.target.value)}
                  >
                    {station.map((station) => {
                      return (
                        <MenuItem key={nanoid()} value={station}>
                          {station}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {!selectedRoute && (
                    <FormHelperText>
                      Selecteaza ruta autobuzului mai intai.
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <TextField
                    inputProps={{ inputMode: "numeric", min: "0" }}
                    labelid="persoane-label"
                    disabled={!selectedStation}
                    type="number"
                    id="nrPersoane"
                    label="Numar de persoane"
                    value={totalPassengers}
                    onChange={(e) => {
                      setTotalPassengers(e.target.value);
                      validateForm();
                    }}
                  />
                  {!selectedStation && (
                    <FormHelperText>
                      Selecteaza statia autobuzului mai intai.
                    </FormHelperText>
                  )}
                </FormControl>
                <Button
                  disabled={!isFormValid}
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Trimite
                </Button>
              </Stack>
            </Card>
          </Box>
          <Snackbar
            open={open}
            anchorOrigin={{ horizontal: "center", vertical: "top" }}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Trimis cu succes!
            </Alert>
          </Snackbar>
        </div>
      )}
    </>
  );
}
