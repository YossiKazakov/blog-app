import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, Typography, DialogActions, Button } from '@mui/material';

function EmptyFieldsModalError({ message, onCloseModal}) {

    return (
        <Dialog open={true}>
            <DialogContent>
                <Typography> {message} </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCloseModal} variant="contained">got it</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EmptyFieldsModalError;
