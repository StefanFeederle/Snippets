<?php

    //if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        
    include "../../database/mysql.php";

    MySQL_select_db("test");
    
    $json = file_get_contents('php://input');
    $response = json_decode($json);
    

    $query = "INSERT INTO sad25_snippets () VALUES ()";
    
    
    header('Content-Type: application/json');

    if (MySQL_query($query)) {
        $json = array(
            'insert' => 'success',
            'snippetid' => mysql_insert_id()

        );
        echo ")]}',\n".json_encode($json);
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        $json = array(
            'insert' => 'failed'
        );
        echo ")]}',\n".json_encode($json);
    }

?>