import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import * as React from 'react';
import { useHistory } from 'react-router';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import FormHelperText from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';
import { useLocation } from 'react-router-dom'

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Stack,
  Typography,
  Container,
  Box,
  CircularProgress
} from '@mui/material';

import { useCallback } from 'react';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import palette from '../theme/palette';
import axios from 'axios';
import { async } from 'regenerator-runtime';

// ----------------------------------------------------------------------




export default function CourseDetail() {
  const location = useLocation();
  
  // routing 
  const history = useHistory();
  
  const listFormation = ()=>{
    history.goBack();
  }

  // consts 

  // UseState
  const [EditMode,setEditMode] = React.useState(false)
  const [typeFormation, setTypeFormatio] = useState('En ligne');

  const intialFormation = {
    "course_id": '',
    "display_name": '',
    "number": '',
    "org":'DjezzyAcademy',
    "run": '',
    "short_description": '',
    "course_type": "En ligne",
    "self_paced": true,
    "invitation_only": false,
    "is_by_approval": false,
    "is_published": false,
  }
  const [formation,setFormation]= React.useState(intialFormation)
  

  const handleChangeTypeFormation = (event) => {
    setTypeFormation(event.target.value);
  };
  const [organisation, setOrganisation] = useState('Djezzy');
  const handleChangeOrganisation = (event) => {
    setOrganisation(event.target.value);
  };

  

  // consts 
  const URL_GET_Org = getConfig().LMS_BASE_URL + "/api/organizations/v0/organizations/";
  // const URL_POST_CreateFormation = getConfig().LMS_BASE_URL.slice(0,7) + 'studio.'+  getConfig().LMS_BASE_URL.slice(7) + "/course/"
  const URL_POST_CreateFormation = 'http://studio.local.overhang.io:8001/course/'
  // usestate
  const [organisations,setOrganisations]= React.useState([])
  const [onSumbition,setOnSumbition]= React.useState(false)
  
  const [requestResult, setRequestResult] = useState({
    'sucess' : null,
    'error': null,
  });

  const [formErrors, setFormErrors] = useState({
    "display_name": null,
    "number": null,
    "run": null,
  });

  // functions 

  const getOrganisations = async ()=>{
    try{
      const result = await getAuthenticatedHttpClient().get(URL_GET_Org)
      console.log(result.data)
      let i =1
      let new_list = []
      while (i<=result.data.num_pages){
        getAuthenticatedHttpClient().get(URL_GET_Org+"?page="+i).then((response) => {
          new_list = [...new_list, ...response.data.results]; 
          setOrganisations(new_list)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
        i = i + 1
      } 
      console.log('organisations',organisations)
    }catch(error){
      console.log(error)
    }
  }

  const createFormation = async() =>{
    try{
      setOnSumbition(true)
      const result = await axios.get('http://studio.local.overhang.io:8001/csrf/api/v1/token')
      const headers = { 
          'Content-Type': 'application/json',
          'X-CSRFToken': result.data.csrfToken, // Include the CSRF token
      }
      try {
        const { data } = await getAuthenticatedHttpClient().post(
          URL_POST_CreateFormation,formation, headers
        );
        if (!data.course_key){
          setRequestResult({'sucess':null, 'error': data.ErrMsg} )
        }else{
          setRequestResult({'sucess':'la formation a été crée avec succès', 'error': null} )
          setFormation(intialFormation)
        }
        setOnSumbition(false)
      }catch (error) {
        setOnSumbition(false)
        console.error('course error:', error);
      }
    }catch(error){
      setOnSumbition(false)
      console.log("error token", error)
    }  
      
  }

  const modifyFormation = async() =>{
    try{
      setOnSumbition(true)
      const result = await axios.get('http://studio.local.overhang.io:8001/csrf/api/v1/token')
      const headers = { 
          'Content-Type': 'application/json',
          'X-CSRFToken': result.data.csrfToken, // Include the CSRF token
      }
      try {
        const { data } = await getAuthenticatedHttpClient().patch(
          URL_POST_CreateFormation+""+formation.course_id,formation, headers
        );
        
        setRequestResult({'sucess':'la formation a été modifié avec succès', 'error': null} )
        setOnSumbition(false)
      }catch (error) {
        setOnSumbition(false)
        setRequestResult({'sucess':null, 'error': 'Veuillez réessayer'})
      }
    }catch(error){
      setOnSumbition(false)
      console.log("error token", error)
    }  
      
  }

  const handleSubmit = useCallback ((event) => {
    if (EditMode){
      modifyFormation()
    }else{
      event.preventDefault()
      // Check if all required fields are filled
      let hasErrors = false;
      const newFormErrors = {};

      if (!formation.display_name) {
        newFormErrors.display_name = 'Nom est obligatoire';
        hasErrors = true;
      }

      if (!formation.number) {
        newFormErrors.number = 'Numero est obligatoire';
        hasErrors = true;
      }

      if (!formation.run) {
        newFormErrors.run = 'Session est obligatoire';
        hasErrors = true;
      }

      if (hasErrors) {
        setFormErrors(newFormErrors);
      } else {
        // Submit the form data (e.g., send it to an API)
        createFormation()
      }
    }
    
  },[formation])

  React.useEffect(()=>{
    getOrganisations()

    if (location.state){
      let self_paced = location.state.pacing == 'self' ? true : false
      setFormation({...location.state,'self_paced': self_paced,'display_name':location.state.name})
      setEditMode(true)
      console.log('location',location.state)
    }
  },[])
  
  React.useEffect(()=>{
    console.log("effect",formation)
  },[formation])

  return (
    
        <React.Fragment>
        <form onSubmit={handleSubmit}>
        <Container>
          
          <Stack direction="row" alignItems="center" spacing={{ xs: 2, sm: 2 }} justifyContent="flex-start" mb={3}>
            <img onClick={listFormation} width={50} src={'/assets/icons/ic_back.png'}></img>
            {EditMode ? 
            <Typography variant="h4" gutterBottom>
              Modifier une formation
            </Typography>
            :
            <Typography variant="h4" gutterBottom>
              Créer une formation
            </Typography>
            }
          </Stack>
          {requestResult.error && 
          <Stack  mb={3}>
            <Alert severity="error">{requestResult.error}</Alert>
          </Stack>
          }
          {requestResult.sucess && 
          <Stack  mb={3}>
            <Alert severity="success">{requestResult.sucess}</Alert>
          </Stack>
          }
          <Card>
            <CardHeader
              title="Informations générals"
            />
            <Divider />
            
            <CardContent>

            <Stack width={'75%'} spacing={{ xs: 3, sm: 3 }} direction="column" useFlexGap flexWrap="wrap">
              {EditMode ? 
              <>
                <TextField
                  required
                  id="nomFormation"
                  name="nomFormation"
                  label="Identifiant de la formation"
                  fullWidth
                  defaultValue={formation.course_id}
                  value={formation.course_id}
                  variant="outlined"
                />
                <FormControl error sx={{ width:'100%' }} >
                  <TextField
                    required
                    id="nomFormation"
                    name="nomFormation"
                    label="Nom de formation"
                    placeholder='par exemple, Introduction au marketing'
                    fullWidth
                    autoComplete="given-name"
                    helperText="Le nom public de votre formations. Il ne peut pas être changé, mais vous pouvez donner un nouveau nom plus tard dans les Réglages avancés."
                    defaultValue={formation.display_name}
                    value={formation.display_name}
                    onChange={(e) => {
                      setFormation({...formation, 'display_name': e.target.value.toString()})
                    }}
                  />
                  {formErrors.display_name && <FormHelperText id="component-error-text">{formErrors.display_name}</FormHelperText> }
                </FormControl>
              </>
              :
              <>
              <FormControl error sx={{ width:'100%' }} >
              <TextField
                required
                id="nomFormation"
                name="nomFormation"
                label="Nom de formation"
                placeholder='par exemple, Introduction au marketing'
                fullWidth
                autoComplete="given-name"
                helperText="Le nom public de votre formations. Il ne peut pas être changé, mais vous pouvez donner un nouveau nom plus tard dans les Réglages avancés."
                defaultValue={formation.display_name}
                value={formation.display_name}
                onChange={(e) => {
                  setFormation({...formation, 'display_name': e.target.value.toString()})
                }}
              />
              {formErrors.display_name && <FormHelperText id="component-error-text">{formErrors.display_name}</FormHelperText> }
              </FormControl>
              <FormControl sx={{ width:'100%' }} >
                <InputLabel id="demo-select-small-label">Organisation</InputLabel>
                <Select
                  required
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  label="Organisation"
                  helperText="Le nom de l'organisation qui commandite cette formation. Note : Le nom de l'organisation fait partie du URL de votre cours. Il ne peut être modifié, mais vous pouvez indiquer un autre nom d'affichage plus tard dans les paramètres avancés.
                  "
                  value={formation.org}
                  onChange={ (event) => {
                      setFormation({...formation, 'org' : event.target.value.toString()})}
                  }
                >
                  {organisations.map((org)=>{
                    const {name} = org
                    return(
                        <MenuItem value={name}>{name}</MenuItem>
                    )
                    
                  })}
                </Select>
              </FormControl>
              <FormControl error>
                <TextField
                  required
                  id="number"
                  name="number"
                  label="Numéro de formation"
                  fullWidth
                  placeholder='par exemple, DataScience101'
                  autoComplete="given-name"
                  helperText="Le nombre unique qui identifie votre formations au sein de votre organisation. Note : Ceci fait partie du URL de votre cours, aucun espace ou caractères spéciaux ne sont permis et il ne peux être modifié.
                  "
                  value={formation.number}
                  onChange={(e) => {
                    const regex = /^[a-zA-Z0-9]*$/; 
                    if (!regex.test(e.target.value.toString())) {
                      setFormErrors({...formErrors, 'number': 'Caractères spéciaux ou espaces non autorisés.'})
                    } else {
                      setFormErrors({...formErrors, 'number': null})
                      setFormation({...formation, 'number': e.target.value.toString()})
                    }
                  }}
                />
                {formErrors.number && <FormHelperText id="component-error-text">{formErrors.number}</FormHelperText> }
              </FormControl>
              <FormControl error>
                <TextField
                  required
                  id="session"
                  name="number"
                  label="Session"
                  fullWidth
                  autoComplete="given-name"
                  value={formation.run}
                  placeholder='par exemple, 2023_T1'
                  helperText="Le période durant lequel le cours va s'exécuter. Note : Ceci fait partie du URL de votre cours, aucun espace ou caractères spéciaux ne sont permis et il ne peux être modifié.                "
                  onChange={(e) => {
                    const regex = /^[a-zA-Z0-9_]*$/;
                    if (!regex.test(e.target.value.toString())) {
                      setFormErrors({...formErrors, 'run': 'Caractères spéciaux ou espaces non autorisés.'})
                    } else {
                      setFormErrors({...formErrors, 'run': null})
                      setFormation({...formation, 'run': e.target.value.toString()})
                    }
                  }}
                />
              {formErrors.run && <FormHelperText id="component-error-text">{formErrors.run}</FormHelperText> }
              </FormControl>
              </>
              }
              
              <Divider />
              <TextField
                multiline
                rows={2}
                maxRows={4}
                id="short-description"
                name="short-description"
                label="short description"
                fullWidth
                value={formation.short_description}
                onChange={(e) => {
                  setFormation({...formation, 'short_description': e.target.value.toString()})
                }}
              />
              <Divider />
              <Stack spacing={{ xs: 15, sm: 15 }} flexDirection={'row'} justifyContent='start' useFlexGap flexWrap="wrap">

                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">Type de formation</FormLabel>
                  <RadioGroup
                    
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    defaultValue={formation.course_type}
                    value={formation.course_type}
                    onChange={(event)=> setFormation({...formation, 'course_type': event.target.value})}
                  >
                    <FormControlLabel value="En ligne" control={<Radio />} label="En ligne" />
                    <FormControlLabel value="Webinaire" control={<Radio />} label="Webinaire" />
                    <FormControlLabel value="Blended" control={<Radio />} label="Blended" />
                    
                  </RadioGroup>
                </FormControl>
              
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">Rythme de formation</FormLabel>
                  <RadioGroup
                    
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    defaultValue={formation.self_paced}
                    value={formation.self_paced}
                    onChange={(event)=> setFormation({...formation, 'self_paced': event.target.value == "true"})}
                  >
                    <FormControlLabel value={false} control={<Radio />} label="Rythme de l’instructeur" />
                    <FormControlLabel value={true} control={<Radio />} label="Rythme de l’apprenant" />
                    
                  </RadioGroup>
                </FormControl>
                
              </Stack>
            <Divider />
            <Stack spacing={{ xs: 15, sm: 15 }} flexDirection={'row'} justifyContent='start' useFlexGap flexWrap="wrap">
              <FormGroup>
                <FormControlLabel required control={<Checkbox checked={formation.invitation_only} 
                onChange={(event) => {
                  setFormation({...formation, 'invitation_only': event.target.checked})
                }}

                />} label="Inscription par invitation seulement" />
                <FormControlLabel required control={<Checkbox checked={formation.is_by_approval} 
                onChange={(event) => {
                  setFormation({...formation, 'is_by_approval': event.target.checked})
                }}
                />} label="Inscription par approbation" />
              </FormGroup>
            </Stack> 
            <Divider />
            <Stack spacing={{ xs: 15, sm: 15 }} flexDirection={'row'} justifyContent='start' useFlexGap flexWrap="wrap">
              <FormGroup>
                <FormControlLabel required control={<Checkbox checked={formation.is_published} 
                onChange={(event) => {
                  setFormation({...formation, 'is_published': event.target.checked})
                }}
                />} label="Publiée" />
              </FormGroup>
            </Stack>  
            </Stack>  
            </CardContent>  
            <Divider />
            <CardActions sx={{ justifyContent: 'flex-end' }}>
              {!onSumbition ? 
              <>
              {EditMode && 
              <Button variant="contained" onClick={
                ()=>{
                  window.open(`http://studio.local.overhang.io:8001/course/${formation.course_id}`, '_blank');
                }
              } sx={{background: palette.INFO , '&:hover':{
                        background: palette.INFO
                        }}} >
                Contenu & Paramètre avancés
              </Button>
              }
              <Button  
                sx={{background: palette.red['darker'] , '&:hover':{
                        background: palette.red['darker']
                        }}} 
                onClick={handleSubmit}
                variant="contained">
                        
                  Enregistrer
              </Button>
              </>
              :
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
              }
              
            </CardActions>
          </Card>
          </Container>
         </form>
         
        </React.Fragment>
    
  );
}