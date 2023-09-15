import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import Alert from '@mui/material/Alert';

// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import palette from '../theme/palette';
import axios from 'axios';
import { getConfig } from '@edx/frontend-platform';
import PostListToolbar from '../sections/@dashboard/user/PostListToolbar';

// ----------------------------------------------------------------------
// front-app-session 
import { useCookies } from 'react-cookie';
import {AppContext} from '@edx/frontend-platform/react';
import { useContext } from 'react';
//

const TABLE_HEAD = [
  { id: 'Title', label: 'Titre', alignRight: false },
  { id: 'Summary', label: 'Résumé', alignRight: false },
  { id: 'number_of_views', label: `Vues`, alignRight: false },
  { id: 'is_published', label: 'Publié', alignRight: false },
  { id: '' },
];


// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}


function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function MyBlogPage() {
  // authn
  let userId = '';
  const { authenticatedUser } = useContext(AppContext);
  const user_data = useContext(AppContext);

  if (authenticatedUser) {
    userId = user_data.authenticatedUser.userId;
  }

  // routing 
  const history = useHistory();
  // Consts

  const URL_GET_Posts = getConfig().LMS_BASE_URL + "/api/posts/v1/myposts/"+userId+"/"

  // UseStates 
  const [posts, setPosts] = useState([])
  const [requestResult, setRequestResult] = useState({
    'sucess' : null,
    'error': null,
  });
  // functions 
  const getPosts = async () =>{
    try {
      const result = await axios.get(URL_GET_Posts)
      setPosts(result.data)
    }   
    catch( error ){
      console.log(error)
    }
  }

  const createPost = ()=>{
    history.push('/blog/posts/create');
  }

  const modifyPost = ()=>{
    history.push({ 
      pathname: '/blog/posts/modify/',
      state: currentSelectRow
      // state: {'id':currentSelectRow.id, 'title':currentSelectRow.title, 'summary':currentSelectRow.summary, 'content':currentSelectRow.content}
     });
  }

  const URL_POST_DeletePost = getConfig().LMS_BASE_URL + "/api/posts/v1/posts/delete/"
  const deletePost = async () => {
      
      try {
        const { data } = await getAuthenticatedHttpClient().delete(
          URL_POST_DeletePost+currentSelectRow.id+"/"
        );
        setRequestResult({'sucess':`l'article ${currentSelectRow.id} a été supprimé avec succès`, 'error': null} )
        getPosts()
        handleCloseMenu()
      }catch (error) {
        setRequestResult({'sucess':null, 'error': 'Veuillez réessayer'})
      }

  }

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [currentSelectRow, setCurrentSelectRow] = useState(null)
  const handleOpenMenu = (event,row) => {
    setCurrentSelectRow(row)
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setCurrentSelectRow(null)
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = posts.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - posts.length) : 0;

  const filteredPosts = applySortFilter(posts, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredPosts.length && !!filterName;


  // 

 
  useEffect(()=>{
    getPosts()
  },[])



  return (
    posts && 
    <>
      <Helmet>
        <title> Course | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Mes articles
          </Typography>
          <Button variant="contained" onClick={createPost} sx={{background: palette.red['darker'] , '&:hover':{
            background: palette.red['darker']
          }}} startIcon={<Iconify icon="eva:plus-fill" />}>
            Créer un article
          </Button>
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
          <PostListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          {/* <Scrollbar> */}
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={posts.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, title,summary, number_of_views,is_published } = row;
                    const selectedUser = selected.indexOf(name) !== -1;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {title}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{summary}</TableCell>

                        <TableCell align="left">{number_of_views}</TableCell>
                        <TableCell align="left">
                          {is_published ? 
                          <Label color={'success'}>Pubilé</Label>
                          :
                          <Label color={'error'}>Non pubilé</Label>
                          }
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(event)=>handleOpenMenu(event,row)}>
                            <Iconify icon={'eva:more-vertical-fill'} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                          Non trouvé
                          </Typography>

                          <Typography variant="body2">
                            Aucune résultat trouvé &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Essayez de vérifier les fautes de frappe ou d'utiliser des mots complets.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          {/* </Scrollbar> */}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={posts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}

      >

        <MenuItem onClick={modifyPost}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Modifier
        </MenuItem>

        <MenuItem  onClick={deletePost} sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Supprimer
        </MenuItem>
      </Popover>
    </>
  );
}
