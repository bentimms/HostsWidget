/** Hosts Widget : Manipulates your /etc/hosts file for development purposes. 
    
    Copyright: Benjamin Timms (ben.timms@gmail.com)
    March 2008

    DISCLAIMER: This computer program is supplied "AS IS".
    The Author disclaims all warranties, expressed or implied, including,
    without limitation, the warranties of merchantability and of fitness
    for  any purpose.  The Author assumes no liability for direct, indirect,
    incidental, special, exemplary, or consequential damages, which may
    result from the use of the computer program, even if advised of the
    possibility of such damage.  There is no warranty against interference
    with your enjoyment of the computer program or against infringement.
    There is no warranty that my efforts or the computer program will
    fulfill any of your particular purposes or needs.  This computer
    program is provided with all faults, and the entire risk of satisfactory
    quality, performance, accuracy, and effort is with the user.

    LICENSE: Permission is hereby irrevocably granted to everyone to use,
    copy, modify, and distribute this computer program, or portions hereof,
    purpose, without payment of any fee, subject to the following
    restrictions:

    1. The origin of this binary or source code must not be misrepresented.

    2. Altered versions must be plainly marked as such and must not be
    misrepresented as being the original binary or source.

    3. The Copyright notice, disclaimer, and license may not be removed
    or altered from any source, binary, or altered source distribution.
*/

var loaded = false;
var maxId  = -1;
var alt    = false;
var debug  = true;

function pdb(message)
{
    if (debug)
    {
        alert(message);
    }
}

function trim(aString) 
{
     return aString.replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ');
}; 

function outHandler(currentStringOnStdout)
{
    // Code that does something with the command's current output like...
    document.getElementById("hostsText").innerHTML = currentStringOnStdout;
}

function removeAllChildNodes(node) 
{
    if (node && node.hasChildNodes && node.removeChild) 
    {
        while (node.hasChildNodes()) 
        {
            node.removeChild(node.firstChild);
        }
    }
} 
function getChildText(linkNode)
{
    linkChildren = linkNode.childNodes;

    var result = '';
    for (i = 0; i < linkChildren.length; i++) 
    {
         linkChild = linkChildren.item(i);

         if (linkChild.nodeType == Node.TEXT_NODE) 
         {
                result = result + linkChild.nodeValue;
         }
    }
    return result;
}

function endHandler()
{
    pdb("Done!");
}

function editHostname(hostId)
{
    pdb("Editing hostname " + hostId);
    
    nodeSpan = document.getElementById('hw_host_' + hostId);
    nodeSpan.setAttribute("onclick", null);
    nodeSpan.innerHTML = '<form  id="hostnameEdit' + hostId + '" onsubmit="javascript:saveHostname(this); return false;">' + 
                         '<input class="hostField" name="hostname" value="' + getChildText(nodeSpan) + '"/>' + 
                         '<input type="hidden" name="oldHostname" value="' + getChildText(nodeSpan) + '">' + 
                         '<input type="hidden" name="hostID" value="' + hostId + '">' + 
                         '</form>';
    hostnameEditForm = document.getElementById('hostnameEdit' + hostId);
    hostnameEditForm['hostname'].focus();
}

function editIP(hostId)
{
    pdb("Editing IP " + hostId);
    
    nodeSpan = document.getElementById('hw_ip_' + hostId);
    nodeSpan.setAttribute("onclick", null);
    
    ipAddress = getChildText(nodeSpan);
    ipFields = ipAddress.split('.'); 
    
    nodeSpan.innerHTML = '<form id="ipEdit' + hostId + '" onsubmit="javascript:saveIP(this); return false;">' + 
                         '<input size="3" name="ipField1" class="ipField" value="' + ipFields[0] + '"/>.' + 
                         '<input size="3" name="ipField2" class="ipField" value="' + ipFields[1] + '"/>.' + 
                         '<input size="3" name="ipField3" class="ipField" value="' + ipFields[2] + '"/>.' + 
                         '<input size="3" name="ipField4" class="ipField" value="' + ipFields[3] + '"/>' + 
                         '<input type="hidden" name="oldIPField1" value="' + ipFields[0] + '">' + 
                         '<input type="hidden" name="oldIPField2" value="' + ipFields[1] + '">' + 
                         '<input type="hidden" name="oldIPField3" value="' + ipFields[2] + '">' + 
                         '<input type="hidden" name="oldIPField4" value="' + ipFields[3] + '">' + 
                         '<input type="hidden" name="hostID" value="' + hostId + '">' + 
                         '</form>';
     ipEditForm = document.getElementById('ipEdit' + hostId);
     ipEditForm['ipField1'].focus();
}

function toggleHost(hostId)
{
    pdb("Toggling: " + hostId);
    nodeSpan = document.getElementById('hw_enabled_' + hostId);
    nodeSpan.setAttribute("dirty", "yes");
//    hostsSave();
}

function saveIP(formObj)
{
    pdb("Saving: " + formObj['hostID'].value);
    var dirty = false;
    hostId      = formObj['hostID'].value;
    ipField1    = formObj['ipField1'].value;
    ipField2    = formObj['ipField2'].value;
    ipField3    = formObj['ipField3'].value;
    ipField4    = formObj['ipField4'].value;
    oldIPField1 = formObj['oldIPField1'].value;
    oldIPField2 = formObj['oldIPField2'].value;
    oldIPField3 = formObj['oldIPField3'].value;
    oldIPField4 = formObj['oldIPField4'].value;
    
    nodeSpan = document.getElementById('hw_ip_' + hostId);
    nodeSpan.setAttribute("onclick", "javascript:editIP("+hostId+"); return false;");

    if ( (ipField1 != oldIPField1) || 
         (ipField2 != oldIPField2) || 
         (ipField3 != oldIPField3) || 
         (ipField4 != oldIPField4) )
    { 
        pdb("Dirty!!");
        nodeSpan.setAttribute("dirty", "yes");
        dirty = true;
    }
    nodeSpan.innerHTML = ipField1 + "." + ipField2 + "." +ipField3 + "." +ipField4;
//    if (dirty) hostsSave();
}

function saveHostname(formObj)
{
    pdb("Saving: " + formObj['hostname'].value);
    var dirty = false;
    hostId      = formObj['hostID'].value;
    hostname    = formObj['hostname'].value;
    oldHostname = formObj['oldHostname'].value;
    
    nodeSpan = document.getElementById('hw_host_' + hostId);
    nodeSpan.setAttribute("onclick", "javascript:editHostname("+hostId+"); return false;");
    if (oldHostname != hostname)
    {
        pdb("Dirty!!");
        nodeSpan.setAttribute("dirty", "yes");
        dirty = true;
    }
    nodeSpan.innerHTML = hostname;
//    if (dirty) hostsSave();
}

if (window.widget)
{
    widget.onshow = onshow;
    widget.onhide = onhide;
}

function onshow () {

}

function onhide()
{
}

function addNewHost()
{
    var newHostName = document.getElementById('addHostField');
    var newIPField1 = document.getElementById('newIpField1');
    var newIPField2 = document.getElementById('newIpField2');
    var newIPField3 = document.getElementById('newIpField3');
    var newIPField4 = document.getElementById('newIpField4');

    var ipPartRegExp = /./;

    var hostnameRegExp = /^[A-Za-z0-9\-\.]+$/;
    
    pdb("Adding host: " + newHostName.value + " - '" + 
                            newIPField1.value + "." +
                            newIPField2.value + "." +
                            newIPField3.value + "." +
                            newIPField4.value) + "'";
    
    if (!((newIPField1.value.length > 0) && (newIPField1.value >= 0) && (newIPField1.value < 255)))
    {
        pdb("Invalid IP field 1 " + ipPartRegExp.test(newIPField1));
        newIPField1.focus();
        return;
    }
    if (!((newIPField2.value.length > 0) && (newIPField2.value >= 0) && (newIPField2.value < 255)))
    {
        pdb("Invalid IP field 2");
        newIPField2.focus();
        return;
    }
    if (!((newIPField3.value.length > 0) && (newIPField3.value >= 0) && (newIPField3.value < 255)))
    {
        pdb("Invalid IP field 3");
        newIPField3.focus();
        return;
    }
    if (!((newIPField4.value.length > 0) && (newIPField4.value >= 0) && (newIPField4.value < 255)))
    {
        pdb("Invalid IP field 4");
        newIPField4.focus();
        return;
    }
    
    if (!hostnameRegExp.test(newHostName.value))
    {
        pdb("Invalid Hostname field");
        newHostName.className = 'hostFieldWarn';
        newHostName.focus();
        return;
    }
    else
    {
        newHostName.className = 'hostField';
    }

    var hostTable  = document.getElementById("hostsTable");
    var addHostRow = document.getElementById("addHostRow");
    maxId = maxId + 1;
    var ipAddress =  newIPField1.value + "." +
                            newIPField2.value + "." +
                            newIPField3.value + "." +
                            newIPField4.value;
    var newRow = getHostRowNode(maxId, newHostName.value, ipAddress, false, true, "yes");
    hostTable.insertBefore(newRow, addHostRow);
    pdb("All OK!");
    
    confirm("Text or question you want to use");
    
    alt = !alt;
    pdb(hostsTable.innerHTML);
    
    hostsData = hostsData + ipAddress + "\t\t" + newHostName.value + " #hw" + maxId + "\n"; 
//    hostsSave();

    newHostName.value = '';
    newIpField1.value = '';
    newIpField2.value = '';
    newIpField3.value = '';
    newIpField4.value = '';
    newHostName.focus();
}

function hostsSave()
{
    doHostsSave();
    /* pdb("Sudo attempt..");
    if (document.getElementById('passwordField').value == '')
    {
        doFlipToBack();
        document.getElementById("passwordWarningField").innerHTML = 'Password required';
        return false;
    }

    document.getElementById("frontSpinner").style.display = "block";
    document.getElementById("backSpinner").style.display = "block";
    document.getElementById("passwordWarningField").innerHTML = '';
    document.getElementById("passwordInfoField").innerHTML = '';

    // Kill any existing sudo session because we don't want any false positives.
    sudoTest = widget.system("/usr/bin/sudo -K", null);
    sudoTest = widget.system("/usr/bin/sudo echo hello", sudoTestDone);
    sudoTest.onreaderror = sudoTestError;
    */
}


function doHostsSave()
{
    pdb("Saving hosts!");
    var hostLines = hostsData.split(/[\n\r]/g);
    for (var i=0; i < hostLines.length; i++)
    {
        hostLines[i] = hostLines[i].replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ');
        var hostLine = hostLines[i].split(/\s+/);
        hostActive = true;
        hostDisabled = true;
        hostId     = -1;
        if ((hostLine.length == 2) || (hostLine.length == 3))
        {
            if (hostLine[0].charAt(0) == "#")
            {
                hostActive = false; 
                hostLine[0] = hostLine[0].substring(1);
            }
            // Check for valid IP addresses
            var ipRegExp = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
            if (!ipRegExp.test(hostLine[0]))
            {
                continue;
            }
            
            if (hostLine.length == 3)
            {
                if (hostLine[2].indexOf("#hw") > -1)
                {
                     hostId = eval(hostLine[2].substring(3));
                     pdb("Checking host.." + hostId);
                     hostDisabled = false;
                     // See if this host is dirty.
                     ipNode = document.getElementById('hw_ip_' + hostId);
                     hostNode = document.getElementById('hw_host_' + hostId);
                     enabledNode = document.getElementById('hw_enabled_' + hostId);
                     
                     pdb(ipNode.attributes.getNamedItem('dirty').value);
                     pdb(hostNode.attributes.getNamedItem('dirty').value);
                     pdb(enabledNode.value);
                     
                     if ((ipNode.attributes.getNamedItem('dirty').value == 'yes') ||
                         (enabledNode.attributes.getNamedItem('dirty').value == 'yes') ||
                         (hostNode.attributes.getNamedItem('dirty').value == 'yes'))
                     {
                         pdb("Altering dirty host..");
                         
                         hostLines[i] = (enabledNode.value == 'on'  ? '' : '#')  + 
                                        getChildText(ipNode) + " " + 
                                        getChildText(hostNode) + " " + 
                                        "#hw"+ hostId;
                         ipNode.setAttribute('dirty', 'no');
                         hostNode.setAttribute('dirty', 'no');
                     }
                }
            }
        }
    }
    widget.system("echo '" + trim(hostLines.join("\n")) + "' > /tmp/hosts", null);
    
    osxVersion = widget.system("/usr/bin/sw_vers", null).outputString;
    if ((osxVersion.indexOf("10.5") > -1) ||
        (osxVersion.indexOf("10.6")))
    {
        pdb("Detected 10.5 or 10.6...");
        widget.system("osascript -e 'do shell script \"mv /tmp/hosts /etc/hosts; dscacheutil -flushcache\" with administrator privileges'", commandDone);
        //widget.system("/usr/bin/osascript HostsWidgetRestartDNS.scpt", commandDone);
    }
    else if (osxVersion.indexOf("10.4") > -1)
    {
        pdb("Detected 10.4...");
        widget.system("/usr/bin/osascript -e 'do shell script \"mv /tmp/hosts /etc/hosts; lookupd -flushcache\" with administrator privileges'", commandDone);
    }
    else
    {
        pdb("Unable to detect OS version..");
    }
    
}

function commandDone(cmd){
    pdb("Command completed: " + cmd.outputString);
}

function getHostRowNode(hostId, hostname, ipAddress, hostDisabled, hostActive, dirty)
{
    var mycurrent_row = document.createElement("tr");
    var mycurrent_cell = document.createElement("td");
    mycurrent_cell.setAttribute("id", "checkBoxCell");
    if (alt) mycurrent_cell.setAttribute("class", "hostsTableAlt");
    var current_text = document.createElement("input");
    current_text.setAttribute("id", "hw_enabled_"+hostId);
    current_text.setAttribute("dirty", dirty);
    current_text.setAttribute("type", "checkbox");
    current_text.setAttribute("onclick", "javascript:toggleHost("+hostId+");");
    if (hostDisabled) current_text.setAttribute("disabled", "true");
    if (hostActive) current_text.setAttribute("checked", "checked");
    mycurrent_cell.appendChild(current_text);
    mycurrent_row.appendChild(mycurrent_cell);

    mycurrent_cell = document.createElement("td");
    mycurrent_cell.setAttribute("id", "hostnameCell");
    if (alt) mycurrent_cell.setAttribute("class", "hostsTableAlt");
    mycurrent_span = document.createElement("span");
    if (hostId > -1)
    {
        mycurrent_span.setAttribute("dirty",dirty);
        mycurrent_span.setAttribute("id", "hw_host_"+hostId);
        mycurrent_span.setAttribute("title", "Click here to edit this hostname");
        mycurrent_span.setAttribute("onclick", "javascript:editHostname("+hostId+"); return false;");
    }
    else
    {
        mycurrent_span.setAttribute("id", "disabledHostText");
        mycurrent_span.setAttribute("title", "This host is not editable.");
    }
    current_text = document.createTextNode(hostname);
    mycurrent_span.appendChild(current_text);
    mycurrent_cell.appendChild(mycurrent_span);
    mycurrent_row.appendChild(mycurrent_cell);

    mycurrent_cell = document.createElement("td");
    mycurrent_cell.setAttribute("id", "ipAddrCell");
    if (alt) mycurrent_cell.setAttribute("class", "hostsTableAlt");
    mycurrent_span = document.createElement("span");
    if (hostId > -1)
    {
        mycurrent_span.setAttribute("dirty", dirty);
        mycurrent_span.setAttribute("id", "hw_ip_"+hostId);
        mycurrent_span.setAttribute("title", "Click to edit this IP address");
        mycurrent_span.setAttribute("onclick", "javascript:editIP("+hostId+"); return false;");
    }
    else
    {
        mycurrent_span.setAttribute("id", "disabledHostText");
        mycurrent_span.setAttribute("title", "This IP is not editable.");
    }
    current_text = document.createTextNode(ipAddress);
    mycurrent_span.appendChild(current_text);
    mycurrent_cell.appendChild(mycurrent_span);
    mycurrent_row.appendChild(mycurrent_cell);
    return mycurrent_row;
}

function hostsLoad()
{
    pdb("Loading hosts!");
    
    // Read the data from the existing hosts file and store it in a global for later. 
    hostsData = widget.system("/bin/cat /etc/hosts", null).outputString;
    
    // Split the results into lines
    var hostLines = hostsData.split(/[\n\r]/g);
    
    // Get a handle to the table
    var hostTable = document.getElementById("hostsTable");
    
    // Empty it out.
    removeAllChildNodes(hostTable);
    
    for (var i=0; i < hostLines.length; i++)
    {
        hostLines[i] = hostLines[i].replace(/^\s+|\s+$/g, '').replace(/\s{2,}/g, ' ');
        var hostLine = hostLines[i].split(/\s+/);
        var hostActive = true;
        var hostDisabled = true;
        var hostId     = -1;
        
        if ((hostLine.length == 2) || (hostLine.length == 3))
        {
            pdb("Hostline: " + hostLine);
            
            // Validate the elements.
            
            // Check for disabled hosts.
            if (hostLine[0].charAt(0) == "#")
            {
                hostActive = false; 
                hostLine[0] = hostLine[0].substring(1);
            }
            // Check for valid IP addresses
            var ipRegExp = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
            if (!ipRegExp.test(hostLine[0]))
            {
                pdb("Invalid IP : " + hostLine[0]);
                continue;
            }
            
            if (hostLine.length == 3)
            {
                if (hostLine[2].indexOf("#hw") > -1)
                {
                     hostId = eval(hostLine[2].substring(3));
                     if (hostId > maxId)
                     {
                         maxId = hostId;
                     }
                     hostDisabled = false;
                }
                else
                {
                    pdb("Strangeness.. we got " + hostLine[3]);
                }
            }
            
            mycurrent_row = getHostRowNode(hostId, hostLine[1], hostLine[0], hostDisabled, hostActive, "no");
            hostsTable.appendChild(mycurrent_row);
            
            alt = !alt;
        }
    }
    
    // Create the row for the "new host" form.
    mycurrent_row = document.createElement("tr");
    // Mark it, so we can get back to it later.
    mycurrent_row.setAttribute("id", "addHostRow");
    // Create the blank cell (where the checkbox would normally be)
    mycurrent_cell = document.createElement("td");
    if (alt) mycurrent_cell.setAttribute("class", "hostsTableNew");
    mycurrent_row.appendChild(mycurrent_cell);
    // Create the cell for the hostname
    mycurrent_cell = document.createElement("td");
    if (alt) mycurrent_cell.setAttribute("class", "hostsTableNew");
    // Create the form for the hostname
    add_form = document.createElement("form");
    add_form.setAttribute("onsubmit", "javascript:addNewHost(this); return false;");
    // Create the input for the hostname and add it to the form.
    hostField = document.createElement("input");
    hostField.setAttribute("class", "hostField");
    hostField.setAttribute("id", "addHostField");
    add_form.appendChild(hostField);
    // Add the form to the cell
    mycurrent_cell.appendChild(add_form);
    // Add the Cell to the row
    mycurrent_row.appendChild(mycurrent_cell);
    // Create the cell for the IP address
    mycurrent_cell = document.createElement("td");
    if (alt) mycurrent_cell.setAttribute("class", "hostsTableNew");
    // Create the form for the hostname
    add_form = document.createElement("form");
    add_form.setAttribute("onsubmit", "javascript:addNewHost(this); return false;");
    // Create the input for an IP address field
    ipField = document.createElement("input");
    ipField.setAttribute("name", "ipField1");
    ipField.setAttribute("id", "newIpField1");
    ipField.setAttribute("size", "3");
    add_form.appendChild(ipField);
    // Append an IP address separator
    current_text = document.createTextNode(".");
    add_form.appendChild(current_text);
    // Create the input for an IP address field
    ipField = document.createElement("input");
    ipField.setAttribute("name", "ipField2");
    ipField.setAttribute("id", "newIpField2");
    ipField.setAttribute("size", "3");
    add_form.appendChild(ipField);
    // Append an IP address separator
    current_text = document.createTextNode(".");
    add_form.appendChild(current_text);
    // Create the input for an IP address field
    ipField = document.createElement("input");
    ipField.setAttribute("name", "ipField3");
    ipField.setAttribute("id", "newIpField3");
    ipField.setAttribute("size", "3");
    add_form.appendChild(ipField);
    // Append an IP address separator
    current_text = document.createTextNode(".");
    add_form.appendChild(current_text);
    // Create the input for an IP address field
    ipField = document.createElement("input");
    ipField.setAttribute("name", "ipField4");
    ipField.setAttribute("id", "newIpField4");
    ipField.setAttribute("size", "3");
    add_form.appendChild(ipField);
    // Add the form to the cell    
    mycurrent_cell.appendChild(add_form);
    // Finally add the IP address cell to the row    
    mycurrent_row.appendChild(mycurrent_cell);
    // And add the row to the table
    hostsTable.appendChild(mycurrent_row);
    
    pdb(hostsTable.innerHTML);
    loaded = true;
    
}

/// These flip the widget from front to back, and from back to front,
/// respectively.
function doFlipToBack()
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");

    if (back.style.display == "block")
    {
        return;
    }
	
    if(window.widget)
    {
        widget.prepareForTransition("ToBack");
    }

    front.style.display="none";
    back.style.display="block";

    if(window.widget)
    {
        setTimeout("widget.performTransition();", 0);
    }
}


function doFlipToFront()
{
    var front = document.getElementById("front");
    var back = document.getElementById("back");
    
    if (front.style.display == "block")
    {
        return;
    }

    if(window.widget)
    {
        widget.prepareForTransition("ToFront");
    }

    back.style.display="none";
    front.style.display="block";
	
    if(window.widget)
    {
        setTimeout("widget.performTransition();", 0);
    }
}

function firstLoad()
{
    if (loaded == false) hostsLoad();
    new AppleGlassButton(document.getElementById("activateButton"), "Activate changes", hostsSave);
}

