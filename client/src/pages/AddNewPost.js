import {
  Card,
  CardContent,
  CardActions,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  MenuItem,
  TextField,
  Button,
  Select,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import EmptyFieldsModalError from '../components/EmptyFieldsModalError';

function AddNewPost({ handleAddPost }) {
  const tagsList = ['Server', 'Frontend', 'Security', 'Analytics', 'Mobile']; // mock tags data
  const [customTag, setCustomTag] = useState('')

  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  const handleSubmit = () => {
    let message = '';
    switch (true) {
      case !title && !content:
        message = 'Please provide title and content';
        break;
      case !title:
        message = 'Please add title';
        break;
      case !content:
        message = 'Please add content';
        break;
      case title.length > 80:
        message = 'Your title is too long (MAX: 80 characters)';
        break;
      default:
        if (selectedTag === 'custom') {
          handleAddPost(uuidv4(), title, content, customTag);
        } else {
          handleAddPost(uuidv4(), title, content, selectedTag);
        }
        navigate('/');
        return;
    }

    setModalMessage(message);
    setShowModal(true);
  }


  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className='container'>
      <Card component='form' className='form' data-testid='addNewPost-card'>
        <CardContent className='formFields'>
          <Typography
            variant='h5'
            component='div'
            className='formTitle'
            data-testid='addNewPost-title'
          >
            Add A New Post
          </Typography>
          <Typography
            gutterBottom
            variant='caption'
            component='div'
            data-testid='addNewPost-required'
          >
            *Required
          </Typography>
          <FormControl sx={{ minWidth: '100%' }}>
            <InputLabel
              required
              htmlFor='title-field'
              data-testid='addNewPost-postTitleLabel'
            >
              Title
            </InputLabel>
            <OutlinedInput
              error={false}
              id='addNewPost-postTitleInput'
              label='Title'
              fullWidth
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
              data-testid='addNewPost-postTitle'
            />
          </FormControl>
          <TextField
            id='addNewPost-postContentInput'
            label='Content'
            multiline
            rows={4}
            fullWidth
            required
            error={false}
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
            }}
            data-testid='addNewPost-postContent'
          />
          <FormControl sx={{ m: 1, minWidth: 'max-content', width: '200px', display: 'flex' }}>
            <InputLabel
              id='select-tag-label'
              data-testid='addNewPost-postTagLabel'
            >
              Tag
            </InputLabel>
            <Select
              labelId='select-tag-label'
              id='addNewPost-postTagSelect'
              value={selectedTag}
              label='Tag'
              onChange={(event) => {
                setSelectedTag(event.target.value);
              }}
              data-testid='addNewPost-postTag'
            >
              {tagsList.map((option) => (
                <MenuItem
                  key={option}
                  value={option}
                  data-testid={`addNewPost-postTagOption-${option}`}
                >
                  {option}
                </MenuItem>
              ))}
              <MenuItem value='custom'>Other</MenuItem>
            </Select>
            {selectedTag === 'custom' && (
              <TextField
                sx={{ marginTop: '10px' }}
                id='addNewPost-customTagInput'
                label='New tag'
                fullWidth
                value={customTag}
                onChange={(event) => {
                  setCustomTag(event.target.value);
                }}
                data-testid='addNewPost-customTag'
              />
            )}
          </FormControl>
        </CardContent>
        <CardActions>
          <Button
            variant='contained'
            size='large'
            data-testid='addNewPost-submitBtn'
            onClick={handleSubmit}
          >
            submit
          </Button>
        </CardActions>
      </Card>
      {
        showModal && (
          <EmptyFieldsModalError message={modalMessage} onCloseModal={handleCloseModal} />
        )
      }
    </div>
  );
}

export default AddNewPost;
