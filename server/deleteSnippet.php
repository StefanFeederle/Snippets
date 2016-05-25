<?php

    //if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        
    include "../../database/mysql.php";

    MySQL_select_db("test");
    
    $json = file_get_contents('php://input');
    $response = json_decode($json);
    
    $whereclause = "";
    if(isset($response->id )){
        $whereclause = " where id = ".intval($response->id);
    }
    
   
    $query = "UPDATE sad25_snippets SET deleted = 1".$whereclause;
    
    
    header('Content-Type: application/json');

    if (MySQL_query($query)) {
        $json = array(
            'delete' => 'success'
        );
        echo ")]}',\n".json_encode($json);
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        $json = array(
            'delete' => 'failed',
            'errormsg' => mysql_error()
        );
        echo ")]}',\n".json_encode($json);
    }
