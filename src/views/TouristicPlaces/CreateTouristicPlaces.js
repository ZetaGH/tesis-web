import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
} from "@material-ui/core";
import { requestCreateOrUpdate } from "./service";
import { useHistory } from "react-router-dom";
import { TextFieldFormik } from "../../components/TextFieldFormik";
import { useSnackbar } from "notistack";
import { SUCCESSFUL_OPERATION } from "../../constants";

const useStyles = makeStyles(() => ({
  root: {},
}));

const CreateRestaurantSchema = Yup.object().shape({
  name: Yup.string().required("*Este campo es requerido"),
  description: Yup.string().required("*Este campo es requerido"),
  address: Yup.string().required("*Este campo es requerido"),
  reference_address: Yup.string().required("*Este campo es requerido"),
  img_url: Yup.string()
    .matches(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/,
      "Porfavor ingresar el formato de URL"
    )
    .required("*Este campo es requerido"),
});

export const CreateTouristicPlaces = ({ className, location, ...rest }) => {
  const domain = "touristic-places";
  const domainLabel = "Lugares Turisticos";
  const item = location.state != null ? location.state[domain] : null;
  const classes = useStyles();
  const history = useHistory();
  const [categories, setCategories] = useState();
  const { enqueueSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues: item
      ? {
          id: item.id,
          name: item.name,
          description: item.description,
          img_url: item.img_url,
          address: item.address,
          reference_address: item.reference_address,
        }
      : {
          name: "",
          description: "",
          img_url: "",
          address: "",
          reference_address: "",
        },
    onSubmit: async (values) => {
      try {
        const result = await requestCreateOrUpdate({
          ...values,
        });
        if (result.success) {
          history.push(`/${domain}`);
          enqueueSnackbar(SUCCESSFUL_OPERATION, { variant: "success" });
        }
      } catch (error) {
        console.log("some error ocurred!", error);
      }
    },
    validationSchema: CreateRestaurantSchema,
  });

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <form autoComplete="off" onSubmit={formik.handleSubmit}>
        <CardHeader
          subheader="La información puede ser editada posteriar a la creación"
          title={`Agregar nuevo ${domainLabel}`}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextFieldFormik
                formik={formik}
                label="Nombre"
                name="name"
                helperTextDefault={`Por favor ingrese el nombre del ${domainLabel}`}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextFieldFormik
                formik={formik}
                label="Descripción"
                name="description"
                helperTextDefault={`Por favor ingrese la descripción del ${domainLabel}`}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextFieldFormik
                formik={formik}
                label="Direccion"
                name="address"
                helperTextDefault={`Por favor ingrese la direccion del ${domainLabel}`}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextFieldFormik
                formik={formik}
                label="Referencias"
                name="reference_address"
                helperTextDefault={`Por favor ingrese la referencia del ${domainLabel}`}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextFieldFormik
                formik={formik}
                label="Imagen (URL)"
                name="img_url"
                helperTextDefault={`Por favor ingresar una url de la imagen del ${domainLabel}`}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button type="submit" color="primary" variant="contained">
            {item == null ? "Crear" : "Actualizar"}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};
