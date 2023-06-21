import os
import boto3
import time
from math import floor
import dotenv
dotenv.load_dotenv()

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    endpoint_url=os.getenv('AWS_ENDPOINT_URL')
)


def upload_addr_to_s3(addr, prefix='', acl="public-read"):
    ext = addr.split('.')[1]
    name = str(floor(time.time()))
    filename = prefix + name + "." + ext

    try:
        s3.upload_file(
            addr,
            os.getenv("AWS_BUCKET_NAME"),
            filename,
            ExtraArgs={
                "ACL": acl,
            }
        )

    except Exception as e:
        # This is a catch all exception, edit this part to fit your needs.
        print("Something Happened: ", e)
        return e

    # after upload file to s3 bucket, return filename of the uploaded file
    return filename


def upload_file_to_s3(file, acl="public-read"):
    ext = file.filename.split('.')[1]
    name = str(floor(time.time()))
    filename = name + "." + ext

    try:
        s3.upload_fileobj(
            file,
            os.getenv("AWS_BUCKET_NAME"),
            filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )

    except Exception as e:
        # This is a catch all exception, edit this part to fit your needs.
        print("Something Happened: ", e)
        return e

    # after upload file to s3 bucket, return filename of the uploaded file
    return filename
