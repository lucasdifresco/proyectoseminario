import React, { useEffect, useState } from "react";
import MaterialTable from 'material-table';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import HeadSection from "../../../logged_out/components/home/HeadSection";
import { listAppointments, findAppointmentsByDoctor, findAppointmentsByPatient } from '../../../controllers/api/api.appointments'
import validadorUsuario from "../../validadorUsuario.js";
import global from "../../../logged_out/components/Global.js";
import { deleteAppointment, createAppointment, updateAppointment } from '../../../controllers/api/api.appointments'
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

export default function MaterialTableDemo() {

  const [turnos, setTurnos] = useState([])
  useEffect(() => {
    obtenerUsuarios()
  }, [])
  console.log('caca')
  const obtenerUsuarios = async () => {
    if (validadorUsuario.esSecretarioAdmin(global.usuarioElegido)) {
      await listAppointments()
        .then(v => setTurnos(v.response))
    }
    else {
      await findAppointmentsByDoctor(6)
        .then(v => {
          console.log(v.response)
          setTurnos(v.response)
        })
    }
  }


  const [state, setState] = useState([])
  useEffect(() =>
    setState(
      turnos.map(v => {
        console.log(v)
        return {
          name: v.patients.nombre,
          surname: v.patients.apellido,
          doctor: v.doctors.apellido,
          date: v.date,
          horarios: v.time,
        }
      })
    )
    , [turnos])

  return (
    <MaterialTable
      icons={tableIcons}
      title="Turnos"
      columns={
        [
          {
            title: 'Nombre',
            field: 'name',
          },
          {
            title: 'Apellido',
            field: 'surname',
          },
          {
            title: 'Doctor',
            field: 'doctor',
          },
          {
            title: 'Fecha',
            field: 'date',
            validate: ({ date }) => date?.trim().length > 7
          },
          {
            title: 'Horario',
            field: 'horarios',
          },
        ]
      }
      data={state}
      localization={{
        body: {
          emptyDataSourceMessage: 'No hay datos por mostrar',
          addTooltip: 'A??adir',
          deleteTooltip: 'Eliminar',
          editTooltip: 'Editar',
          editRow: {
            deleteText: '??Segura(o) que quiere eliminar este turno?',
            cancelTooltip: 'Cancelar',
            saveTooltip: 'Guardar',
          },
        },
        header: {
          actions: 'Acciones',
        },
        toolbar: {
          searchPlaceholder: 'Buscar',
          searchTooltip: 'Buscar',
        },
        pagination: {
          firstAriaLabel: 'Primera p??gina',
          firstTooltip: 'Primera p??gina',
          labelDisplayedRows: '{from}-{to} de {count}',
          labelRowsPerPage: 'Filas por p??gina:',
          labelRowsSelect: 'filas',
          lastAriaLabel: 'Ultima p??gina',
          lastTooltip: 'Ultima p??gina',
          nextAriaLabel: 'Pagina siguiente',
          nextTooltip: 'Pagina siguiente',
          previousAriaLabel: 'Pagina anterior',
          previousTooltip: 'Pagina anterior',
        },
      }}
      options={{
        actionsColumnIndex: -1,
      }}
      editable={{
        onRowAdd: async (newData) => {
          await createAppointment(
            {
              doctor_id: 6,
              date: newData.date,
              time: newData.horarios,
              patient_id: 1,
            }
          ).then(() => {
            setState(
              state.concat(newData)
            )
          })
        },
        onRowDelete: async (oldData) => {
          await deleteAppointment(
            {
              doctor_id: 6,
              date: oldData.date,
              time: oldData.horarios,
              patient_id: 1,
            }
          )
          window.location.reload(true);
        },/*
        onRowUpdate: async (newData, oldData) => {
          await updateAppointment(
            {

            }
          ).then(() => {
            setState((prevState) => {
              const data = [...prevState];
              data[data.indexOf(oldData)] = newData;
              return { ...prevState, data };
            }
            )
          })
        },*/
      }}
    />
  );
}