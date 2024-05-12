CREATE TABLE [dbo].[User](
	[IDUser] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[PhoneNo] [nvarchar](50) NOT NULL,
	[Address] [nvarchar](50) NOT NULL,
	[Email] [nvarchar](50) UNIQUE NOT NULL,
	[Password] [nvarchar](500) NOT NULL,
	[Role] [nvarchar](50) CHECK ([Role] IN ('user', 'admin', 'companyAdmin')) NOT NULL,
	[AdminKey] [int]
)

drop table [Order];
drop table [User];
delete from [Order]
delete from [User]
select * from [User];
drop table [Product]
drop table 

CREATE TABLE [dbo].[Order](
	[IDOrder] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,
	[IDUser] [int] NOT NULL FOREIGN KEY REFERENCES [User](IDUser),
	[IDCompany] [int] NOT NULL FOREIGN KEY REFERENCES [Company](IDCompany),
	[OrderDate] [datetime] NOT NULL,
	[Status] [nvarchar](50) NOT NULL,
	[PaymentMethod] [nvarchar](50) NOT NULL,
	[TotalPrice] [numeric](8, 2) NOT NULL,
	[Products] [nvarchar](300) NULL
)
drop table [User]
drop table [Order]

CREATE TABLE [dbo].[History](
	[IDOrder] [int] NOT NULL,
	[User] [nvarchar](50) NOT NULL,
	[Company] [nvarchar](50) NOT NULL,
	[OrderDate] [datetime] NOT NULL,
	[Status] [nvarchar](50) NOT NULL,
	[PaymentMethod] [nvarchar](50) NOT NULL,
	[TotalPrice] [numeric](8, 2) NOT NULL,
	[Products] [nvarchar](300) NULL,
)
select * from History
drop table History

create TRIGGER History_Trigger
on [Order]
AFTER INSERT, UPDATE
as
insert into History 
select IDOrder, [User].Email, [Company].Name, GETDATE(), Status, PaymentMethod, TotalPrice, Products from inserted
inner join [User]
on inserted.IDUser = [User].IDUser
inner join [Company]
on inserted.IDCompany = [Company].IDCompany

drop trigger History_Trigger

CREATE TABLE [dbo].[Category](
	[IDCategory] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[IDCompany] [int] NOT NULL FOREIGN KEY REFERENCES Company(IDCompany)
)
ALTER TABLE [dbo].[Category] DROP CONSTRAINT [FK__Category__IDComp__151B244E];

ALTER TABLE [dbo].[Category]
ADD CONSTRAINT [FK__Category__IDComp__151B244E]
FOREIGN KEY ([IDCompany]) REFERENCES [dbo].Company
ON DELETE CASCADE;

SELECT 
    fk.name AS FK_name,
    tp.name AS parent_table,
    ref.name AS referenced_table
FROM 
    sys.foreign_keys AS fk
INNER JOIN 
    sys.tables AS tp ON fk.parent_object_id = tp.object_id
INNER JOIN 
    sys.tables AS ref ON fk.referenced_object_id = ref.object_id
WHERE 
    tp.name = 'Product';

	ALTER TABLE [dbo].[Product] DROP CONSTRAINT [FK__Product__IDCateg__17F790F9];
	ALTER TABLE [dbo].[Product]
ADD CONSTRAINT [FK__Product__IDCateg__17F790F9]
FOREIGN KEY ([IDCategory]) REFERENCES [dbo].Category
ON DELETE CASCADE;
	
CREATE TABLE [dbo].[Allergen](
	[IDAllergen] [int] PRIMARY KEY NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
)

CREATE TABLE [dbo].[Company](
	[IDCompany] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[ImagePath] [nvarchar](150) NOT NULL
)

CREATE TABLE [dbo].[Product](
	[IDProduct] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](30) NOT NULL,
	[ImagePath] [nvarchar](100) NOT NULL,
	[Description] [ntext] NOT NULL,
	[Price] [numeric](8, 2) NOT NULL,
	[IDCategory] [int] NOT NULL FOREIGN KEY REFERENCES Category(IDCategory),
	[Gram] [int] NOT NULL,
	[Allergens] [nvarchar](50) NULL,
)

drop table Product;
drop table Category;
drop table Company;

drop table [Order];
drop table [User];


--------------------------------------------------------------------------------------------

insert into [User](Name, PhoneNo, Address, Email, Password, IsAdmin, AdminKey) values 
('admin', '+375333251105', 'Sverdlova', 'admin', 'admin', 1, 0),
('adminBal', '+375333251105', 'Sverdlova', 'adminBal', 'admin', 1, 1),
('user', '+375333251105', 'Sverdlova', 'user', 'user', 0, null);

declare @i bit, @o int, @v int
exec Auth 'admin', 'admin', @i, @o, @v

delete from [User];

insert into [Order](IDUser, IDCompany, OrderDate, Status, PaymentMethod, TotalPrice, Products) values
(3, 1, GETDATE(), N'Принят', N'Наличные', 20.20, N'Тест');

delete from [Order];

insert into [Allergen](IDAllergen, Name) values
(1, N'Орехи'),
(2, N'Молоко'),
(3, N'Яйца'),
(4, N'Рыба'),
(5, N'Пшеница'),
(6, N'Соя'),
(7, N'Грибы'),
(8, N'Цитрусовые');

delete from [Allergen];

insert into [Company](Name, ImagePath) values
(N'Балкон', N'balkon.png'),
(N'Burger King', N'bk.png');

delete from [Company];
select * from Company

insert into [Category](Name, IDCompany) values
(N'Лапша', 1),
(N'Роллы', 1),
(N'Горячее', 1),
(N'Супы', 1),
(N'Гарниры', 1),
(N'Десерты', 1),
(N'Напитки', 1),
(N'Комбо', 2),
(N'Бургеры', 2),
(N'Картошка', 2),
(N'Напитки', 2),
(N'Десерты', 2),
(N'Соусы', 2);

delete from [Category];

insert into [Product](Name, ImagePath, Description, Price, IDCategory, Gram, Allergens) values
(N'Яичная с креветками', 'https://eda.yandex/images/3798638/30b7bf0051594cc5948aef2199408728-400x400.jpeg', N'Яичная лапша, яйцо, капуста микс, цукини, сладкий перец, креветки, кисло-сладкий соус, красный лук, кунжут', 19.90, 1, 330, '34');

-----------------------------------------------------------------------------------------------------

create Procedure [dbo].[GetCompanies]
AS
SELECT * FROM Company

exec GetCompanies

alter Procedure [dbo].[Auth]
@Username nvarchar(50), @Password nvarchar(50), @isadmin bit OUTPUT, @id int OUTPUT, @key int OUTPUT
AS
SELECT @isadmin = IsAdmin, @id = IDUser, @key = AdminKey from [User] Where Email=@Username AND Password=@Password;

ALTER procedure [dbo].[Reg]
@name nvarchar(50), @phoneNo nvarchar(50), @address nvarchar(50), @email nvarchar(50), @password nvarchar(50), @id int OUTPUT
AS
INSERT INTO [dbo].[User] (Name, PhoneNo, Address, Email, Password, IsAdmin) values (@name, @phoneNo, @address, @email,@password, 0);
select @id = IDUser from [User] where Email = @email;

alter procedure [dbo].[GetUser]
@id int
as
select Name, PhoneNo, Address, Email, Password from [User] where IDUser = @id

create procedure [dbo].[UpdateUser]
@id int, @name nvarchar(50), @phoneNo nvarchar(50), @address nvarchar(50), @email nvarchar(50), @password nvarchar(50)
AS
update [dbo].[User] set Name = @name, PhoneNo = @phoneNo, Address = @address, Email = @email, Password = @password where IDUser = @id;

alter procedure GetMyOrders
@id int
as
select IDOrder, Name, OrderDate, Status, PaymentMethod, TotalPrice, Products from [Order]
inner join [Company]
on [Order].IDCompany = [Company].IDCompany
where IDUser = @id

create procedure GetCategories
@id int
as
select IDCategory, Name from Category where IDCompany = @id


alter procedure GetProducts
@id int
as
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where IDCategory = @id

exec GetProducts 1

GetProduct

create procedure GetProduct
@id int
as
select Name, ImagePath, Description, Price, IDCategory, Gram, Allergens from Product where IDProduct = @id

create procedure GetCompanyByCategory
@id int
as
select IDCompany from Category where IDCategory = @id

create procedure CreateOrder
@iduser int, @idcompany int, @method nvarchar(50), @price float, @prod nvarchar(50)
as
insert into [Order](IDUser, IDCompany, OrderDate, Status, PaymentMethod, TotalPrice, Products) values
(@iduser, @idcompany, GETDATE(), N'Принят', @method, @price, @prod);

create procedure SearchCompanies
@search nvarchar(50)
as
select * from Company where Name like '%' + @search + '%';

create procedure GetCompanyName
@id int
as
select Name from Company where IDCompany = @id

create procedure SearchProducts
@id int, @search nvarchar(50)
as
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where IDCategory = @id and Name like '%' + @search + '%';

select * from Product where Allergens not like '%4%' or Allergens is null

alter procedure SearchAllergens
@id int, @search nvarchar(50)
as
if LEN(@search) = 8
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 3, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 4, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 5, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 6, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 7, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 8, 1) + '%' and IDCategory = @id
or Allergens is null and IDCategory = @id
if LEN(@search) = 7
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 3, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 4, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 5, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 6, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 7, 1) + '%' and IDCategory = @id
or Allergens is null and IDCategory = @id
if LEN(@search) = 6
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 3, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 4, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 5, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 6, 1) + '%' and IDCategory = @id
or Allergens is null and IDCategory = @id
if LEN(@search) = 5
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 3, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 4, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 5, 1) + '%' and IDCategory = @id
or Allergens is null and IDCategory = @id
if LEN(@search) = 4
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 3, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 4, 1) + '%' and IDCategory = @id
or Allergens is null and IDCategory = @id
if LEN(@search) = 3
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 3, 1) + '%' and IDCategory = @id
or Allergens is null and IDCategory = @id
if LEN(@search) = 2
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and IDCategory = @id
or Allergens is null and IDCategory = @id
if LEN(@search) = 1
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and IDCategory = @id
or Allergens is null and IDCategory = @id

exec SearchAllergens 1, '45'

alter procedure SearchAandP
@id int, @psearch nvarchar(50), @search nvarchar(50)
as
if LEN(@search) = 8
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 3, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 4, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 5, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 6, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 7, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 8, 1) + '%' and IDCategory = @id and Name like '%' + @psearch + '%'
or Allergens is null and IDCategory = @id and Name like '%' + @psearch + '%'
if LEN(@search) = 7
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 3, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 4, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 5, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 6, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 7, 1) + '%' and IDCategory = @id and Name like '%' + @psearch + '%'
or Allergens is null and IDCategory = @id and Name like '%' + @psearch + '%'
if LEN(@search) = 6
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 3, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 4, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 5, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 6, 1) + '%' and IDCategory = @id and Name like '%' + @psearch + '%'
or Allergens is null and IDCategory = @id and Name like '%' + @psearch + '%'
if LEN(@search) = 5
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 3, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 4, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 5, 1) + '%' and IDCategory = @id and Name like '%' + @psearch + '%'
or Allergens is null and IDCategory = @id and Name like '%' + @psearch + '%'
if LEN(@search) = 4
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 3, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 4, 1) + '%' and IDCategory = @id and Name like '%' + @psearch + '%'
or Allergens is null and IDCategory = @id and Name like '%' + @psearch + '%'
if LEN(@search) = 3
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 3, 1) + '%' and IDCategory = @id and Name like '%' + @psearch + '%'
or Allergens is null and IDCategory = @id and Name like '%' + @psearch + '%'
if LEN(@search) = 2
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and
Allergens not like '%' + SUBSTRING(@search, 2, 1) + '%' and IDCategory = @id and Name like '%' + @psearch + '%'
or Allergens is null and IDCategory = @id and Name like '%' + @psearch + '%'
if LEN(@search) = 1
select IDProduct, Name, ImagePath, Description, Price, Gram, Allergens from Product where 
Allergens not like '%' + SUBSTRING(@search, 1, 1) + '%' and IDCategory = @id and Name like '%' + @psearch + '%'
or Allergens is null and IDCategory = @id and Name like '%' + @psearch + '%'

create procedure GetAllergen
@id int
as
select Name from Allergen where IDAllergen = @id

create procedure DeleteUser
@id int
as
delete [User] where IDUser = @id

create procedure CheckEmail
@email nvarchar(50), @valid bit OUTPUT
as
begin
if (select COUNT(*) from [User] where Email = @email) = 0 
	set @valid = 1
else 
	set @valid = 0
select @valid
end

drop procedure CheckEmail

declare @ans bit
exec CheckEmail 'plutoe98@gmail.com', @ans

create function CheckEmailFunc (@email nvarchar(50))
returns bit
as
begin
declare @valid bit
if (select COUNT(*) from [User] where Email = @email) = 0 
	set @valid = 1
else 
	set @valid = 0
return @valid
end

select [dbo].CheckEmailFunc('plutoe98@gmail.com')

create procedure CheckCompany
@product int, @company int, @valid bit OUTPUT
as
begin
if (
select IDCompany from [Product]
inner join [Category]
on [Product].IDCategory = [Category].IDCategory
where IDProduct = @product
) = @company 
	set @valid = 1
else 
	set @valid = 0
select @valid
end

declare @ans bit
exec CheckCompany 1, 1, @ans

https://eda.yandex/images/3772784/363315778e80282c639d899dfc8819e4-450x300.jpg
https://eda.yandex/images/3490902/5ce3a8059f71e9de916f6a0c7eabe5ad-450x300.jpg bk

alter procedure DeleteCompany
@id int
as
begin
delete [Order] where IDCompany = @id
delete Product where IDCategory IN (select IDCategory from Category where IDCompany = @id)
delete Category where IDCompany = @id
delete Company where IDCompany = @id
end

create procedure CreateCompany
@name nvarchar(50), @path nvarchar(150)
as 
insert into [Company](Name, ImagePath) values
(@name, @path);

create procedure UpdateCompany
@id int,@name nvarchar(50), @path nvarchar(150)
as 
update [Company] set Name = @name, ImagePath = @path where IDCompany = @id

create procedure GetOrders
as
select IDOrder, [Company].Name, OrderDate, Status, PaymentMethod, TotalPrice, Products, [Order].IDUser, [User].Email from [Order]
inner join [Company]
on [Order].IDCompany = [Company].IDCompany
inner join [User]
on [Order].IDUser = [User].IDUser

create procedure GetUsers
as
select * from [User] where IDUser != 1

create procedure UpdateRights
@id int, @isadmin bit, @key int
as
update [User] set IsAdmin = @isadmin, AdminKey = @key where IDUser = @id 

create procedure GetHistory
as
select * from History

create procedure ClearOrders
as
delete [Order]

create procedure GetCompanyOrders
@id int
as
select IDOrder, [User].PhoneNo, OrderDate, Status, PaymentMethod, TotalPrice, Products, [Order].IDUser, [User].Email from [Order]
inner join [User]
on [Order].IDUser = [User].IDUser
where IDCompany = @id

create procedure ChangeStatus
@id int, @status nvarchar(50)
as
update [Order] set Status = @status where IDOrder = @id

create procedure GetCompanyHistory
@name nvarchar(50)
as
select * from History where Company = @name

create procedure DeleteProduct
@id int
as
delete Product where IDProduct = @id

create procedure CreateProduct
@name nvarchar(50), @path nvarchar(100), @desc ntext, @price numeric(8, 2), @category int, @gram int, @allerg nvarchar(50)
as
insert into [Product](Name, ImagePath, Description, Price, IDCategory, Gram, Allergens) values
(@name, @path, @desc, @price, @category, @gram, @allerg);

create procedure UpdateProduct
@id int, @name nvarchar(50), @path nvarchar(100), @desc ntext, @price numeric(8, 2), @category int, @gram int, @allerg nvarchar(50)
as
update [Product] set [Name] = @name, ImagePath = @path, Description = @desc, Price = @price, IDCategory = @category, Gram = @gram, Allergens = @allerg
where IDProduct = @id

create procedure DeleteCategory
@id int
as
begin
delete Product where IDCategory = @id
delete Category where IDCategory = @id
end

create procedure GetCategory
@id int
as
select [Name] from Category where IDCategory = @id

create procedure UpdateCategory
@id int, @name nvarchar(50)
as
update Category set Name = @name where IDCategory = @id

create procedure CreateCategory
@name nvarchar(50), @company int
as
insert Category(Name, IDCompany) values (@name, @company)

create procedure ClearOrdersCompany
@id int
as
delete [Order] where IDCompany = @id

delete History



EXEC sp_configure 'show advanced options', 1
RECONFIGURE
GO
 
-- Enable the xp_cmdshell procedure
EXEC sp_configure 'xp_cmdshell', 1
RECONFIGURE
GO

DECLARE @cmd nvarchar(1000), @out nvarchar(1000)
SET @out = (select  * from dbo.Allergen for json path)
print @out
SET @cmd = 'echo ' + @out + ' > C:\Users\Erik\Desktop\3course\Delivery\Json\Allergen.json'
print @cmd
EXEC delivery..xp_cmdshell @cmd

DECLARE @cmd nvarchar(1000), @out nvarchar(1000)
SET @out = (select  * from dbo.Category for json path)
print @out
SET @cmd = 'echo ' + @out + ' > C:\Users\Erik\Desktop\3course\Delivery\Json\Category.json'
print @cmd
EXEC delivery..xp_cmdshell @cmd

DECLARE @cmd nvarchar(1000), @out nvarchar(1000)
SET @out = (select  * from dbo.Company for json path)
print @out
SET @cmd = 'echo ' + @out + ' > C:\Users\Erik\Desktop\3course\Delivery\Json\Company.json'
print @cmd
EXEC delivery..xp_cmdshell @cmd

DECLARE @cmd nvarchar(4000), @out nvarchar(4000)
SET @out = (select  * from dbo.History for json path)
print @out
SET @cmd = 'echo ' + @out + ' > C:\Users\Erik\Desktop\3course\Delivery\Json\History.json'
print @cmd
EXEC delivery..xp_cmdshell @cmd


DECLARE @cmd nvarchar(1000), @out nvarchar(1000)
SET @out = (select  * from dbo.[Order] for json path)
print @out
SET @cmd = 'echo ' + @out + ' > C:\Users\Erik\Desktop\3course\Delivery\Json\Order.json'
print @cmd
EXEC delivery..xp_cmdshell @cmd

DECLARE @cmd nvarchar(MAX), @out nvarchar(MAX)
SET @out = (select  * from dbo.Product for json path)
print @out
SET @cmd = 'echo ' + @out + ' > C:\Users\Erik\Desktop\3course\Delivery\Json\Product.json'
print @cmd
EXEC delivery..xp_cmdshell @cmd

create procedure CompanyToJson
as
begin
	DECLARE @cmd nvarchar(4000), @out nvarchar(4000)
	SET @out = (select  * from dbo.[Company] for json path)
	print @out
	SET @cmd = 'echo ' + @out + ' > C:\Users\Erik\Desktop\3course\Delivery\Json\Company.json'
	print @cmd
	EXEC delivery..xp_cmdshell @cmd
end
drop procedure CompanyToJson

CREATE TABLE [dbo].[UserImport](
	[IDUser] [int] PRIMARY KEY IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[PhoneNo] [nvarchar](50) NOT NULL,
	[Address] [nvarchar](50) NOT NULL,
	[Email] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](50) NOT NULL,
	[IsAdmin] [bit] NOT NULL,
	[AdminKey] [int]
)

CREATE PROCEDURE UserFromJSON
@FilePath NVARCHAR(255)
AS
BEGIN
    DECLARE @ImportQuery NVARCHAR(MAX);
    SET @ImportQuery = 'INSERT INTO [dbo].UserImport SELECT * FROM OPENROWSET(BULK ''' + @FilePath + ''', SINGLE_CLOB) AS json;';
    EXEC sp_executesql @ImportQuery;
END;

DECLARE @ImportQuery NVARCHAR(MAX);
    SET @ImportQuery = 'INSERT INTO [dbo].UserImport SELECT * FROM OPENROWSET(BULK "C:\Users\Erik\Desktop\3course\Delivery\Json\User.json", SINGLE_CLOB) AS json;';
    EXEC sp_executesql @ImportQuery;

SELECT BulkColumn
INTO [dbo].UserImport
FROM OPENROWSET(BULK 'C:\Users\Erik\Desktop\3course\Delivery\Json\User.json', SINGLE_CLOB) as j

create procedure UserFromJson
as
begin
SELECT UserImport.*
FROM OPENROWSET(BULK 'C:\Users\Erik\Desktop\3course\Delivery\Json\User.json', SINGLE_CLOB) AS j
CROSS APPLY OPENJSON(BulkColumn) WITH (
    [IDUser] [int],
	[Name] [nvarchar](50),
	[PhoneNo] [nvarchar](50),
	[Address] [nvarchar](50),
	[Email] [nvarchar](50),
	[Password] [nvarchar](50),
	[IsAdmin] [bit],
	[AdminKey] [int]
) AS UserImport;
end

drop procedure UserFromJSON






create function CountUsers()
returns int
as
begin
return (select COUNT(*) from [User])
end

alter function CompanyAveragePrice(@CompanyId int)
returns numeric(8, 2)
as
begin
return (
select AVG(Price) from [Product]
inner join Category
on Category.IDCategory = Product.IDCategory
where IDCompany = @CompanyId)
end

create function AveragePrices()
returns table
as
return select [Name] as [Ресторан], [dbo].CompanyAveragePrice(IDCompany) as [Средняя цена продукта] from [Company]

create function GetRCP()
returns table
as
return select [Company].[Name] as [Ресторан], [Category].[Name] as [Категория], Product.[Name] as [Товар] from Product
inner join Category
on [Product].IDCategory = [Category].IDCategory
inner join Company
on [Category].IDCompany = [Company].IDCompany


select [dbo].CountUsers()
select [dbo].CompanyAveragePrice(1)
select * from [dbo].AveragePrices()
select * from [dbo].GetRCP()
select * from [dbo].GetOrdersFunc()



create function GetOrdersFunc()
returns table
as
return select IDOrder as [Номер заказа], [User].[Name] as [Имя пользователя], [Company].[Name] as [Ресторан], OrderDate as [Дата], [Status] as [Статус], PaymentMethod as [Метод оплаты], TotalPrice as [Стоимость], Products as [Товары] from [Order]
inner join [User]
on [Order].IDUser = [User].IDUser
inner join [Company]
on [Order].IDCompany = [Company].IDCompany


grant execute to [User]
drop server role Viewer

ALTER DATABASE delivery COLLATE SQL_Latin1_General_CP1_CI_AS 


ALTER DATABASE AUDIT SPECIFICATION [DatabaseAuditSpecification-20231213-040708]
FOR SERVER AUDIT [AuditDelivery]
ADD (DELETE ON DATABASE::[delivery] BY [Admin]),
ADD (EXECUTE ON DATABASE::[delivery] BY [Admin]),
ADD (INSERT ON DATABASE::[delivery] BY [Admin]),
ADD (RECEIVE ON DATABASE::[delivery] BY [Admin]),
ADD (REFERENCES ON DATABASE::[delivery] BY [Admin]),
ADD (SELECT ON DATABASE::[delivery] BY [Admin]),
ADD (UPDATE ON DATABASE::[delivery] BY [Admin]),
ADD (DELETE ON DATABASE::[delivery] BY [Company]),
ADD (EXECUTE ON DATABASE::[delivery] BY [Company]),
ADD (INSERT ON DATABASE::[delivery] BY [Company]),
ADD (RECEIVE ON DATABASE::[delivery] BY [Company]),
ADD (REFERENCES ON DATABASE::[delivery] BY [Company]),
ADD (SELECT ON DATABASE::[delivery] BY [Company]),
ADD (UPDATE ON DATABASE::[delivery] BY [Company]),
ADD (DELETE ON DATABASE::[delivery] BY [User]),
ADD (EXECUTE ON DATABASE::[delivery] BY [User]),
ADD (INSERT ON DATABASE::[delivery] BY [User]),
ADD (RECEIVE ON DATABASE::[delivery] BY [User]),
ADD (REFERENCES ON DATABASE::[delivery] BY [User]),
ADD (SELECT ON DATABASE::[delivery] BY [User]),
ADD (UPDATE ON DATABASE::[delivery] BY [User])
WITH (STATE = OFF)
GO

sp_configure 'show advanced options', 1;
GO
RECONFIGURE;
GO
sp_configure 'Agent XPs', 1;
GO
RECONFIGURE
GO

select ENCRYPTBYPASSPHRASE('c3psfrs', 'mypass')

BEGIN
    FOR i IN 1 .. 100000
        LOOP
            exec CreateProduct 'product' + i, 'https://eda.yandex/images/2783965/65fc7d5f7cb82ed982d5b9ea2e162b96-216x188.jpeg', 'description', 5, 3005, 10
        END LOOP;
END;

DECLARE @i INT = 1;
WHILE @i <= 100000
    BEGIN
        exec CreateProduct @i, 'https://eda.yandex/images/2783965/65fc7d5f7cb82ed982d5b9ea2e162b96-216x188.jpeg', 'description', 5, 3005, 10, '1';
		set @i = @i + 1;
    END;

delete Product where IDCategory = 3005

select COUNT(*) from Product

select * from Product where [Name] = '63472'
select * from Product

CREATE INDEX index2 ON Product (IDProduct);
CREATE CLUSTERED INDEX index1 ON Product (IDProduct);

delete Product where IDCategory = 3005

delete [Order]
delete [History]