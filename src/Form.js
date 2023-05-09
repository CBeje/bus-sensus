import * as React from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import {
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

export default function Form() {
  const [lines, setLines] = useState([]);
  const [selectedLine, setSelectedLine] = useState("");
  const [route, setRoute] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [station, setStation] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [totalPassengers, setTotalPassengers] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://random-data-api.com/api/users/random_user?size=10"
        );
        const data = await response.json();

        setLines(
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
        setErrorMessage("Eroare de comunicare cu serverul!");
      }
    }
    fetchData();
  }, []);

  function validateForm() {
    if (
      !selectedLine ||
      !selectedRoute ||
      !selectedStation ||
      !totalPassengers
    ) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  }

  function handleSubmit() {
    const time = timeStamp(new Date());
    setTotalPassengers(0);

    const handlePost = async () => {
      try {
        const response = await fetch("http://localhost:3003/posts", {
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
          }),
        });

        const data = await response.json();
        setOpen(true);
      } catch (error) {
        setErrorMessage("Eroare de comunicare cu serverul! (POST)");
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

  return (
    <>
      {message ? (
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {message}
        </MuiAlert>
      ) : (
        <Card elevation={2} align="center" sx={{ m: 2, mt: 5 }}>
          <Typography variant="h4" sx={{ m: 2 }}>
            BusSensus
          </Typography>
          <Stack spacing={4} m={4}>
            <FormControl>
              <InputLabel id="linia-label">Linia</InputLabel>
              <Select
                labelId="linia-label"
                value={selectedLine}
                id="Linia"
                label="Linia"
                onChange={(e) => setSelectedLine(e.target.value)}
              >
                {lines.map((line, index) => {
                  return (
                    <MenuItem key={index} value={line}>
                      {line}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel id="ruta-label">Ruta</InputLabel>
              <Select
                labelId="ruta-label"
                value={selectedRoute}
                disabled={!selectedLine}
                id="Ruta"
                label="Ruta"
                onChange={(e) => setSelectedRoute(e.target.value)}
              >
                {route.map((route, index) => {
                  return (
                    <MenuItem key={index} value={route}>
                      {route}
                    </MenuItem>
                  );
                })}
              </Select>
              {!selectedLine && (
                <FormHelperText>
                  Selecteaza, mai intai, linia autobuzului.
                </FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <InputLabel id="statia-label">Statia</InputLabel>
              <Select
                labelId="statia-label"
                value={selectedStation}
                disabled={!selectedRoute}
                id="Statia"
                label="Statia"
                onChange={(e) => setSelectedStation(e.target.value)}
              >
                {station.map((station, index) => {
                  return (
                    <MenuItem key={index} value={station}>
                      {station}
                    </MenuItem>
                  );
                })}
              </Select>
              {!selectedRoute && (
                <FormHelperText>
                  Selecteaza, mai intai, ruta autobuzului.
                </FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <TextField
                InputProps={{
                  inputProps: { min: 0, max: 100 },
                }}
                onKeyPress={(event) => {
                  if (event?.key === "-" || event?.key === "+") {
                    event.preventDefault();
                  }
                }}
                disabled={!selectedStation}
                type="number"
                id="nrPersoane"
                label="Numar de pasageri"
                value={totalPassengers}
                onChange={(e) => {
                  setTotalPassengers(e.target.value);
                  validateForm();
                }}
              />
              {!selectedStation && (
                <FormHelperText>
                  Selecteaza, mai intai, statia autobuzului.
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
          <Snackbar
            open={open}
            anchorOrigin={{ horizontal: "center", vertical: "top" }}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Trimis cu succes!
            </MuiAlert>
          </Snackbar>
        </Card>
      )}
    </>
  );
}
