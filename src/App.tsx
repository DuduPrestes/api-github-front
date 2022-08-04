import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import StarIcon from "@mui/icons-material/Star";

export default function App() {
  interface User {
    login: string;
    avatar_url: string;
    html_url: string;
    twitter_username: string;
  }

  interface Repos {
    id: number;
    name: string;
    html_url: string;
    stargazers_count: number;
  }

  const [txtUser, setTxtUser] = useState("");

  function handleChange(event: any) {
    setTxtUser(event.target.value);
  }

  const [user, setUser] = useState<User>();
  const [repos, setRepos] = useState<Repos[]>();

  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  function PesquisarUsuario() {
    axios
      .get("https://localhost:7250/GetUsuario?usuario=" + txtUser)
      .then((c) => {
        console.log(c.data);
        if (c.status == 200) {
          if (c.data[0].blog != "") {
            window.open("http://" + c.data[0].blog, "_blank");
          }
          if (c.data[0].twitter_username != null) {
            window.open(
              "https://twitter.com/" + c.data[0].twitter_username,
              "_blank"
            );
          }

          setUser(c.data[0]);
          setRepos(c.data[1]);
          setOpenSuccess(true);
          setTimeout(function () {
            setOpenSuccess(false);
          }, 3000);
        } else if (c.status == 204) {
          setOpenError(true);
          setTimeout(function () {
            setOpenError(false);
          }, 3000);
        }
      });
  }

  useEffect(() => {}, []);

  return (
    <div className="App">
      <Snackbar open={openSuccess}>
        <Alert severity="success">User found!</Alert>
      </Snackbar>
      <Snackbar open={openError}>
        <Alert severity="error">User not found!</Alert>
      </Snackbar>
      <h1>Pesquisa de Usuários GitHub</h1>
      <TextField
        id="outlined-basic"
        label="Usuário"
        variant="outlined"
        value={txtUser}
        onChange={handleChange}
      />
      <br></br> <br></br>
      <Button variant="contained" onClick={PesquisarUsuario}>
        {" "}
        Pesquisar
      </Button>
      <br></br> <br></br>
      <Card>
        <Box sx={{ p: 2, display: "flex" }}>
          <Avatar variant="rounded" src={user ? user.avatar_url : ""} />
          <Stack spacing={0.5}>
            <a href={user?.html_url} target="_blank">
              {" "}
              <Typography fontWeight={700}>{user?.login}</Typography>
            </a>
          </Stack>
        </Box>
      </Card>
      <br></br>
      <h3>Respositórios</h3>
      <table>
        {repos
          ?.sort(function (a, b) {
            return a.stargazers_count > b.stargazers_count ? -1 : 1;
          })
          .map((r) => (
            <tr key={r.id}>
              <td>
                <a href={r.html_url} target="_blank">
                  {r.name}
                </a>
              </td>
              {/* <td>{r.stargazers_count}</td> */}
              <td>
                {Array.from(Array(r.stargazers_count), (e, i) => {
                  return <StarIcon style={{ color: "#a9a900" }}></StarIcon>;
                })}
              </td>
            </tr>
          ))}
      </table>
    </div>
  );
}
