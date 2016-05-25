<?php
    include "../../database/mysql.php";
    //sleep(2);
    MySQL_select_db("test");
    
    $json = file_get_contents('php://input');
    $response = json_decode($json);

    $possibleFields = ["id", "name", "code", "owner", "language"];

    $query = "UPDATE sad25_snippets SET 
        name = '".$response->name."', 
        language = '".$response->language."', 
        tags = '".json_encode($response->tags)."',
        comment = '".$response->comment."',
        code = '".mysql_real_escape_string($response->code)."', 
        owner = '".$response->owner."'
        WHERE id = '".$response->id."'";

    $fp = fopen('file.txt', 'w');
    fwrite($fp, print_r(json_encode($response->tags), TRUE));
    fclose($fp);
    
    header('Content-Type: application/json');
    if (MySQL_query($query)) {
        $json = array(
            'update' => 'success'
        );
        echo ")]}',\n".json_encode($json);
    } else {
        header('HTTP/1.1 500 Internal Server Error');
        $json = array(
            'update' => 'failed',
            'errormsg' => mysql_error()
        );
        echo ")]}',\n".json_encode($json);
    }
?>